/** What a normalised community image actually costs, at a few settings. */
import sharp from "sharp";

const QUERIES = ["banana", "golden retriever", "chicago skyline", "espresso machine", "roller coaster"];

const SETTINGS = [
  { edge: 1600, quality: 80 },
  { edge: 1400, quality: 80 },
  { edge: 1280, quality: 78 },
  { edge: 1280, quality: 72 },
];

const UA = "the-floor-bench/1.0 (+https://the-floor-game.vercel.app)";
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const firstImage = async (query) => {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    `&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    "&gsrlimit=1&gsrnamespace=6&prop=imageinfo&iiprop=url|size&iiurlwidth=2000&format=json";
  const response = await fetch(url, { headers: { "User-Agent": UA } });
  const data = await response.json();
  const page = Object.values(data?.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.thumburl;
};

const totals = new Map(SETTINGS.map((s) => [`${s.edge}/${s.quality}`, 0]));
let sampled = 0;

for (const query of QUERIES) {
  const source = await firstImage(query);
  if (!source) {
    console.log(`${query}: no result`);
    continue;
  }

  const response = await fetch(source, { headers: { "User-Agent": UA } });
  if (!response.ok) {
    console.log(`${query}: HTTP ${response.status}`);
    continue;
  }

  const input = Buffer.from(await response.arrayBuffer());
  const row = [];

  for (const { edge, quality } of SETTINGS) {
    const out = await sharp(input)
      .rotate()
      .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    row.push(`${edge}/${quality}: ${kb(out.byteLength).padStart(7)}`);
    totals.set(`${edge}/${quality}`, totals.get(`${edge}/${quality}`) + out.byteLength);
  }

  sampled += 1;
  console.log(`${query.padEnd(18)} src ${kb(input.byteLength).padStart(8)}   ${row.join("  ")}`);
}

if (sampled === 0) process.exit(1);

console.log(`\nAcross ${sampled} images -- per 50-item category, and how many fit in R2's free 10 GB:`);
for (const [setting, total] of totals) {
  const average = total / sampled;
  const perCategory = average * 50;
  console.log(
    `  ${setting.padEnd(10)} avg ${kb(average).padStart(8)}   category ${(perCategory / 1024 / 1024)
      .toFixed(1)
      .padStart(5)} MB   ~${Math.floor((10 * 1024 ** 3) / perCategory)} categories`
  );
}
