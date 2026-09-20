/**
 * Does the browse page reach past the first page?
 *
 * The API has always paged; the page asked for one page and dropped `hasMore`,
 * so everything past the first 24 was unreachable. Needs a deployment with
 * more than one page of published categories to mean anything.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3100";
const bypass = process.env.VERCEL_BYPASS;

const results = [];
const check = (name, passed, detail = "") => {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? `  -- ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1400, height: 1000 } })).newPage();

try {
  if (bypass) {
    await page.goto(`${BASE}/?x-vercel-protection-bypass=${bypass}&x-vercel-set-bypass-cookie=true`, {
      waitUntil: "domcontentloaded",
    });
  }

  const total = await fetch(`${BASE}/api/community/categories?offset=0`)
    .then((r) => r.json())
    .then(async (first) => {
      let n = first.categories.length;
      let more = first.hasMore;
      while (more) {
        const next = await fetch(`${BASE}/api/community/categories?offset=${n}`).then((r) => r.json());
        n += next.categories.length;
        more = next.hasMore && next.categories.length > 0;
      }
      return n;
    });
  console.log(`   ${total} published categories in total`);

  await page.goto(`${BASE}/community`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const cardsOf = () =>
    page.locator('a[href^="/community/"]:not([href$="/create"])').count();

  const firstPage = await cardsOf();
  check("first page shows a bounded number of cards", firstPage === 24, `${firstPage} cards`);

  const loadMore = page.getByRole("button", { name: "Load more" });
  check("a Load more button appears when there's another page", await loadMore.isVisible());

  await loadMore.click();
  await page.waitForTimeout(2500);

  const afterLoad = await cardsOf();
  check("clicking it appends the rest", afterLoad === total, `${afterLoad} of ${total}`);

  const names = await page
    .locator('a[href^="/community/"]:not([href$="/create"])')
    .allTextContents();
  check(
    "no category appears twice",
    new Set(names).size === names.length,
    `${names.length} cards, ${new Set(names).size} distinct`
  );

  check(
    "the button goes away at the end",
    !(await loadMore.isVisible().catch(() => false))
  );
  check(
    "and says so",
    await page.getByText(new RegExp(`That.s all ${total} of them`)).isVisible().catch(() => false)
  );

  // Switching sort must start over, not append to the previous ordering.
  // Poll rather than sleeping a fixed amount: a cold database takes a couple
  // of seconds, and a fixed wait either flakes or slows every run down.
  await page.getByRole("button", { name: "new", exact: true }).click();
  let afterSort = await cardsOf();
  for (let i = 0; i < 20 && afterSort !== 24; i += 1) {
    await page.waitForTimeout(500);
    afterSort = await cardsOf();
  }
  check("switching sort resets to one page", afterSort === 24, `${afterSort} cards`);

  // While it's fetching, the stale grid must not be clickable. Hold the
  // request open rather than racing a warm database, which answers faster than
  // the assertion can run.
  await page.route("**/api/community/categories?**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.continue();
  });

  await page.getByRole("button", { name: "top", exact: true }).click();
  await page.waitForTimeout(600);

  const busyGrid = page.locator('div[aria-busy="true"]').first();
  check("the previous results are marked busy while loading", await busyGrid.isVisible());
  check(
    "and are not clickable",
    (await busyGrid.evaluate((el) => getComputedStyle(el).pointerEvents)) === "none"
  );
  await page.unroute("**/api/community/categories?**");
} catch (error) {
  check(`threw: ${error.message}`, false);
  await page.screenshot({ path: "/tmp/pagination-failure.png" }).catch(() => {});
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length === 0 ? 0 : 1);
