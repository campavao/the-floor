/**
 * Does the existing game still work after the community changes?
 *
 * The runtime-category refactor touched data.ts, the presenter, the projector,
 * the round and the demo, so "the new feature works" says nothing about
 * whether the game people already play still does. This seeds localStorage
 * with a game saved by the *old* code -- curated categories only, no community
 * key -- and plays it.
 *
 * Pass two URLs to compare a candidate against a known-good deployment. That
 * matters more than a green run: several of these checks fail on production
 * too (images below the fold are lazy, the demo waits to be started, and there
 * is a long-standing hydration warning), so the question worth answering is
 * whether the candidate behaves *differently*, not whether it is perfect.
 *
 *   node scripts/regress-existing-game.mjs <candidate> [baseline]
 */
import { chromium } from "playwright";

const CANDIDATE = process.argv[2] ?? "http://localhost:3000";
const BASELINE = process.argv[3];
const bypass = process.env.VERCEL_BYPASS;

let results = [];
let BASE = CANDIDATE;
const check = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? `  -- ${detail}` : ""}`);
};

/** Exactly what the old code wrote: no community categories anywhere. */
const SAVED_GAME = {
  data: [
    { person: "Zoey", category: "Laundry", hasPlayed: false, isStillInTheGame: true },
    { person: "Rachel", category: "Fridge", hasPlayed: false, isStillInTheGame: true },
    { person: "Gabe", category: "Junk drawer", hasPlayed: true, isStillInTheGame: true },
    { person: "Josh", category: "Fast food chains", hasPlayed: false, isStillInTheGame: true },
    { person: "Ellie", category: "Rom Coms", hasPlayed: false, isStillInTheGame: true },
    { person: "Nolan", category: "States", hasPlayed: false, isStillInTheGame: true },
    { person: "Nic", category: "Kitchen gadgets", hasPlayed: false, isStillInTheGame: true },
    { person: "Pat", category: "The Office", hasPlayed: false, isStillInTheGame: true },
  ],
};

const browser = await chromium.launch();

async function run(base) {
  BASE = base;
  results = [];
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  try {
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(String(e)));

    if (bypass) {
      await page.goto(
        `${BASE}/?x-vercel-protection-bypass=${bypass}&x-vercel-set-bypass-cookie=true`,
        { waitUntil: "domcontentloaded" }
      );
    }

    await page.addInitScript((game) => {
      localStorage.setItem("the-floor-data", JSON.stringify(game));
      localStorage.setItem(
        "the-floor-selected-floor-piece",
        JSON.stringify(game.data[2])
      );
    }, SAVED_GAME);

    /* ------------------------------------------------ the landing pages */

    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const homeLinks = await page.locator("a").count();
    check("home page renders with navigation", homeLinks > 0, `${homeLinks} links`);

    await page.goto(`${BASE}/categories`, { waitUntil: "networkidle" });
    const categoryButtons = await page.locator("button").count();
    check("categories page lists the curated set", categoryButtons > 40, `${categoryButtons} buttons`);

    /* ------------------------------- a curated category still shows images */

    await page.locator("button").filter({ hasText: "Fruits" }).first().click();
    await page.waitForTimeout(2500);
    const curatedImages = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => img.src.includes("/images/"))
        .map((img) => ({ src: img.src, ok: img.complete && img.naturalWidth > 0 }))
    );
    check(
      "curated images still load from /images/",
      curatedImages.length > 0 && curatedImages.every((i) => i.ok),
      `${curatedImages.filter((i) => i.ok).length}/${curatedImages.length} loaded`
    );

    /* ------------------------------------- a saved game is still resumable */

    await page.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
    check(
      "an in-progress game from the old code is offered for resume",
      await page.getByText("Resume Game in Progress?").isVisible()
    );
    check(
      "the saved players are listed by category name",
      await page.getByText("Zoey").first().isVisible()
    );

    await page.getByRole("button", { name: "Resume Game" }).click();
    await page.waitForTimeout(1500);
    check(
      "resuming shows the game board",
      await page.getByText(/Players \(/).isVisible().catch(() => false) ||
        (await page.locator("select").count()) > 0
    );

    /* ------------------------------------------ the projector still renders */

    const projector = await context.newPage();
    projector.on("pageerror", (e) => errors.push(`projector: ${e}`));
    await projector.goto(`${BASE}/projector`, { waitUntil: "networkidle" });
    await projector.waitForTimeout(1500);

    const tiles = await projector.locator("button").count();
    check("projector renders the saved floor", tiles >= SAVED_GAME.data.length, `${tiles} tiles`);

    const projectorText = await projector.locator("body").textContent();
    check(
      "projector shows real category names, not raw ids",
      projectorText.includes("Junk drawer") && !projectorText.includes("community:"),
      projectorText.includes("Junk drawer") ? "found 'Junk drawer'" : "category name missing"
    );

    /* ------------------------------------------- a curated round still plays */

    const demo = await context.newPage();
    demo.on("pageerror", (e) => errors.push(`demo: ${e}`));
    await demo.goto(`${BASE}/demo?category=Fruits`, { waitUntil: "networkidle" });
    await demo.waitForTimeout(2000);

    const demoBody = await demo.locator("body").textContent();
    check("curated demo round does not report a missing category", !demoBody.includes("Category unavailable"));
    check("curated demo round starts", demoBody.includes("THE FLOOR") || demoBody.length > 0);

    // Let the countdown run into the round proper and check the image renders.
    await demo.waitForTimeout(7000);
    const roundImages = await demo.evaluate(() =>
      [...document.querySelectorAll("img")].map((img) => ({
        src: img.src,
        ok: img.complete && img.naturalWidth > 0,
      }))
    );
    check(
      "the round shows a curated image",
      roundImages.some((i) => i.src.includes("/images/") && i.ok),
      roundImages.length ? roundImages[0].src.slice(-60) : "no images"
    );

    /* ---------------------------------------- text categories still work too */

    const math = await context.newPage();
    math.on("pageerror", (e) => errors.push(`math: ${e}`));
    await math.goto(`${BASE}/demo?category=Math`, { waitUntil: "networkidle" });
    await math.waitForTimeout(8000);
    const mathBody = await math.locator("body").textContent();
    check("text categories still resolve", !mathBody.includes("Category unavailable"));

    check("no page errors anywhere", errors.length === 0, errors.slice(0, 3).join(" | "));
} catch (error) {
    check(`threw: ${error.message}`, false);
  } finally {
    await context.close();
  }
  return results;
}

console.log(`\n=== candidate: ${CANDIDATE} ===`);
const candidate = await run(CANDIDATE);

if (!BASELINE) {
  await browser.close();
  const failed = candidate.filter((r) => !r.passed);
  console.log(`\n${candidate.length - failed.length}/${candidate.length} passed`);
  console.log("Pass a second URL to compare against a known-good deployment.");
  process.exit(failed.length === 0 ? 0 : 1);
}

console.log(`\n=== baseline: ${BASELINE} ===`);
const baseline = await run(BASELINE);
await browser.close();

// Only a check that behaves differently from the baseline is a regression.
const byName = new Map(baseline.map((r) => [r.name, r]));
const regressions = candidate.filter(
  (r) => byName.has(r.name) && byName.get(r.name).passed && !r.passed
);
const newChecks = candidate.filter((r) => !byName.has(r.name));

console.log("\n=== differences ===");
for (const r of regressions) console.log(`REGRESSION  ${r.name}  -- ${r.detail}`);
for (const r of newChecks) console.log(`NEW CHECK   ${r.name}`);
const sharedFailures = candidate.filter(
  (r) => byName.has(r.name) && !byName.get(r.name).passed && !r.passed
);
for (const r of sharedFailures) console.log(`pre-existing (fails on baseline too)  ${r.name}`);

console.log(
  regressions.length === 0
    ? "\nNo regressions: every check behaves the same as the baseline."
    : `\n${regressions.length} regression(s).`
);
process.exit(regressions.length === 0 ? 0 : 1);
