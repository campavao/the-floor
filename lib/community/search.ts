import type { ImageCredit } from "./types";

/**
 * Image search that runs in the visitor's browser.
 *
 * Both sources below are free, keyless, and send `Access-Control-Allow-Origin`,
 * so the picker costs us nothing at all: no function invocations, no API key to
 * rotate, no bandwidth through Vercel. Only the image the author actually keeps
 * is ever sent to our server.
 *
 * This replaces the Google path the earlier attempt used. Google's Custom
 * Search JSON API is closed to new customers and shuts down on 2027-01-01, and
 * scraping the HTML results from a datacenter IP gets a consent page rather
 * than pictures.
 *
 * The trade-off is honest: Commons and Openverse are excellent for animals,
 * food, places, plants and public figures, and thin for branded or
 * pop-culture items. That's what the paste-a-URL and upload paths are for.
 */

export type ImageSource = "commons" | "openverse";

export type ImageResult = {
  id: string;
  /** Small version, for the picker grid. */
  thumbUrl: string;
  /** Full resolution. Only this one gets sent to the upload route. */
  fullUrl: string;
  width: number;
  height: number;
  title: string;
  credit: ImageCredit;
};

export const SOURCE_LABELS: Record<ImageSource, string> = {
  commons: "Wikimedia Commons",
  openverse: "Openverse",
};

type SearchOptions = {
  source: ImageSource;
  /** Drop anything whose long edge is under this -- it'll look soft on a TV. */
  minEdge: number;
  limit?: number;
  signal?: AbortSignal;
};

const commonsSearch = async (
  query: string,
  { limit = 24, signal }: { limit?: number; signal?: AbortSignal }
): Promise<ImageResult[]> => {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrlimit: String(limit),
    gsrnamespace: "6",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    // Grid thumbnails only. The full-size original is what we hand the server,
    // so the picker stays cheap even with two dozen results on screen.
    iiurlwidth: "400",
    format: "json",
    origin: "*",
  }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Commons returned HTTP ${response.status}`);

  const data = await response.json();
  const pages = data?.query?.pages;
  if (!pages) return [];

  return Object.values(pages).flatMap((page): ImageResult[] => {
    const entry = page as Record<string, unknown>;
    const info = (entry.imageinfo as Array<Record<string, unknown>>)?.[0];
    if (!info?.url || !info.thumburl) return [];

    const meta = info.extmetadata as
      | Record<string, { value?: string }>
      | undefined;
    const stripTags = (value?: string) =>
      value?.replace(/<[^>]*>/g, "").trim() || null;

    return [
      {
        id: `commons-${entry.pageid}`,
        thumbUrl: String(info.thumburl),
        fullUrl: String(info.url),
        width: Number(info.width ?? 0),
        height: Number(info.height ?? 0),
        title: String(entry.title ?? "").replace(/^File:/, ""),
        credit: {
          source: "Wikimedia Commons",
          sourceUrl: String(info.descriptionurl ?? ""),
          author: stripTags(meta?.Artist?.value),
          license: stripTags(meta?.LicenseShortName?.value),
        },
      },
    ];
  });
};

const openverseSearch = async (
  query: string,
  { limit = 24, signal }: { limit?: number; signal?: AbortSignal }
): Promise<ImageResult[]> => {
  const url = new URL("https://api.openverse.org/v1/images/");
  url.search = new URLSearchParams({
    q: query,
    page_size: String(limit),
    // We resize and sometimes erase parts of the image, so we need licences
    // that allow modification, and commercial use keeps the donate button
    // uncomplicated.
    license_type: "commercial,modification",
  }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Openverse returned HTTP ${response.status}`);

  const data = await response.json();
  const results = (data?.results ?? []) as Array<Record<string, unknown>>;

  return results.flatMap((result): ImageResult[] => {
    if (!result.url) return [];
    return [
      {
        id: `openverse-${result.id}`,
        thumbUrl: String(result.thumbnail ?? result.url),
        fullUrl: String(result.url),
        width: Number(result.width ?? 0),
        height: Number(result.height ?? 0),
        title: String(result.title ?? ""),
        credit: {
          source: String(result.source ?? "Openverse"),
          sourceUrl: String(result.foreign_landing_url ?? ""),
          author: (result.creator as string) || null,
          license: result.license
            ? `CC ${String(result.license).toUpperCase()}`
            : null,
        },
      },
    ];
  });
};

export async function searchImages(
  query: string,
  { source, minEdge, limit, signal }: SearchOptions
): Promise<ImageResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results =
    source === "commons"
      ? await commonsSearch(trimmed, { limit, signal })
      : await openverseSearch(trimmed, { limit, signal });

  // Reported dimensions aren't always present. Keep unknowns rather than
  // hiding them -- the server checks the real bytes anyway and will say no.
  return results.filter(
    (result) =>
      !result.width ||
      !result.height ||
      Math.max(result.width, result.height) >= minEdge
  );
}

/**
 * What to type into the image search for a given item.
 *
 * "Apple" alone finds the company; "Apple fruit" finds fruit. Appending the
 * category name is the same trick the original desktop tool used.
 */
export const defaultQuery = (itemName: string, categoryName: string): string =>
  `${itemName} ${categoryName}`.trim();

/**
 * Find pictures for one item, with the category name as a hint rather than a
 * requirement.
 *
 * Both back ends treat extra words as AND, so `"Slush Puppie Cursed gas station
 * snacks"` matches nothing at all -- the disambiguation that helps `"Apple
 * Fruits"` actively destroys any category whose name isn't itself a common
 * search term. Ask the specific way first, then fall back to the bare item
 * name so a made-up category name can't leave every cell empty.
 */
export async function searchForItem(
  itemName: string,
  categoryName: string,
  options: SearchOptions
): Promise<ImageResult[]> {
  const hinted = defaultQuery(itemName, categoryName);

  if (hinted !== itemName) {
    const results = await searchImages(hinted, options);
    if (results.length > 0) return results;
  }

  return searchImages(itemName, options);
}
