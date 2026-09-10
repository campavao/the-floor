import { LIMITS, serperApiKey } from "@/lib/community/config";
import { fail, handle, json } from "@/lib/community/http";
import { cleanText } from "@/lib/community/validate";

/**
 * Google image results, for the things free-licence archives don't have.
 *
 * Commons and Openverse are excellent for animals, food, places and public
 * figures and contain essentially no trademarked artwork -- searching them for
 * "Tony the Tiger" returns a wristwatch, and "Snap Crackle and Pop" returns a
 * tugboat. That isn't a query problem, it's what those archives are.
 *
 * This proxies Serper, which needs a key and so can't run in the browser like
 * the other two. It's opt-in: without SERPER_API_KEY the source simply isn't
 * offered. The free allowance is 2,500 searches a month, which is why the UI
 * keeps this off the automatic path by default -- one category would spend
 * fifty of them.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const key = serperApiKey();
    if (!key) {
      return fail("Web image search isn't configured on this deployment.", 503);
    }

    const body = await request.json().catch(() => ({}));
    const query = cleanText((body as Record<string, unknown>)?.q).slice(0, 200);
    if (!query) return fail("Give me something to search for.");

    const response = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 20 }),
      signal: AbortSignal.timeout(12_000),
    }).catch(() => undefined);

    if (!response?.ok) {
      console.error("[community] serper:", response?.status);
      return fail(
        response?.status === 403
          ? "The web image search key was rejected, or its quota is spent."
          : "Web image search is unavailable right now.",
        503
      );
    }

    const data = (await response.json()) as {
      images?: Array<Record<string, unknown>>;
    };

    const images = (data.images ?? [])
      .filter((image) => {
        const width = Number(image.imageWidth ?? 0);
        const height = Number(image.imageHeight ?? 0);
        // Same floor as everywhere else: anything smaller looks soft on a TV.
        return (
          !width || !height || Math.max(width, height) >= LIMITS.minSourceImageEdge
        );
      })
      .map((image, index) => ({
        id: `web-${index}-${String(image.imageUrl ?? "")}`,
        thumbUrl: String(image.thumbnailUrl ?? image.imageUrl ?? ""),
        fullUrl: String(image.imageUrl ?? ""),
        width: Number(image.imageWidth ?? 0),
        height: Number(image.imageHeight ?? 0),
        title: String(image.title ?? ""),
        credit: {
          // These are ordinary web results, not licensed stock. The page they
          // came from is recorded so the category can point at a source.
          source: String(image.source ?? image.domain ?? "Web"),
          sourceUrl: String(image.link ?? "") || null,
          author: null,
          license: null,
        },
      }))
      .filter((image) => image.fullUrl);

    return json({ images });
  });
}
