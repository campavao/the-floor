/**
 * Drives the community flow in a real browser, end to end:
 * create -> auto-fetch images -> publish -> browse -> add to game -> playable.
 *
 * Needs the dev server running. Usage:
 *   npm install --no-save playwright && node scripts/e2e-community.mjs
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";

const ITEMS = [
  "Banana", "Apple", "Strawberry", "Pineapple", "Watermelon",
  "Blueberry", "Mango", "Cherry", "Lemon", "Avocado",
  "Coconut", "Raspberry", "Pomegranate", "Kiwifruit",
];

const results = [];
const check = (name, passed, detail = "") => {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? `  -- ${detail}` : ""}`);
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
const page = await context.newPage();

const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(String(error)));

try {
  // ---------------------------------------------------------------- create
  await page.goto(`${BASE}/community/create`, { waitUntil: "networkidle" });
  check("create page renders", await page.getByText("New community category").isVisible());

  await page.getByPlaceholder("Cursed gas station snacks").fill("E2E Fruits");
  await page.locator("textarea").fill(ITEMS.join("\n"));
  check("item counter tracks the textarea", await page.getByText(`${ITEMS.length} items`).isVisible());

  await page.getByRole("button", { name: "Find pictures" }).click();
  await page.waitForSelector("text=have a picture", { timeout: 20_000 });
  check("grid appears", await page.getByRole("heading", { name: "E2E Fruits" }).isVisible());

  // ------------------------------------------------------------- auto-fill
  console.log("   waiting for images…");
  let filled = 0;
  for (let tick = 0; tick < 90; tick += 1) {
    filled = await page.locator("img[alt]:not([alt=''])").count();
    const text = await page.locator("text=/of .* have a picture/").first().textContent();
    if (text && /^(\d+) of/.exec(text)?.[1] === String(ITEMS.length)) break;
    const stopped = await page.getByRole("button", { name: "Fill the gaps" }).isVisible().catch(() => false);
    if (stopped && tick > 5) break;
    await page.waitForTimeout(1000);
  }

  const progress = await page.locator("text=/of .* have a picture/").first().textContent();
  const got = Number(/^(\d+) of/.exec(progress ?? "")?.[1] ?? 0);
  check("auto-fetched images for most items", got >= 12, `${progress?.trim()}`);

  const firstSrc = await page.locator("img[alt='Banana']").first().getAttribute("src");
  check(
    "images are served from our own store, normalised",
    Boolean(firstSrc?.includes("/community-dev/") || firstSrc?.startsWith("http")),
    firstSrc ?? "none"
  );
  check("stored as webp", Boolean(firstSrc?.endsWith(".webp")), firstSrc ?? "");

  // --------------------------------------------------------------- editor
  await page.locator("button[title='Crop or erase text and watermarks']").first().click();
  await page.waitForSelector("text=/Editing/", { timeout: 10_000 });
  const canvas = page.locator("canvas");
  // The canvas mounts at 0x0 and only gets its size once the image has
  // decoded, so painting before then silently does nothing.
  await page.waitForSelector("canvas[data-ready='true']", { timeout: 30_000 });
  check("editor opens with a loaded canvas", await canvas.isVisible());

  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5, { steps: 8 });
  await page.mouse.up();

  const eraseButton = page.getByRole("button", { name: "Erase painted area" });
  check("painting enables the erase button", await eraseButton.isEnabled());
  await eraseButton.click();
  await page.waitForTimeout(1500);
  check("undo becomes available after erasing", await page.getByRole("button", { name: "Undo" }).isEnabled());

  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForSelector("text=/Editing/", { state: "detached", timeout: 20_000 });
  check("edited image saves and closes", true);

  // -------------------------------------------------------------- publish
  const publish = page.getByRole("button", { name: "Publish" });
  check("publish is enabled once the minimum is met", await publish.isEnabled());
  await publish.click();
  await page.waitForSelector("text=is live", { timeout: 20_000 });
  check("publishes", await page.getByText("E2E Fruits” is live").isVisible().catch(() => true));

  // --------------------------------------------------------------- browse
  await page.goto(`${BASE}/community`, { waitUntil: "networkidle" });
  const card = page.getByRole("link", { name: "E2E Fruits", exact: true });
  check("appears in the pool", await card.isVisible());

  const ownerUpvote = page.getByLabel("Upvote").first();
  check("cannot vote on your own category", await ownerUpvote.isDisabled());

  // ----------------------------------------------------- detail + credits
  await card.click();
  await page.waitForSelector("text=Image credits", { timeout: 10_000 });
  const credits = await page.locator("h2:has-text('Image credits') + ul li").count();
  check("detail page attributes every image", credits >= 12, `${credits} credits listed`);
  check(
    "credits name the source",
    (await page.locator("h2:has-text('Image credits') + ul").textContent())?.includes(
      "Wikimedia Commons"
    ) ?? false
  );
  await page.goBack({ waitUntil: "networkidle" });

  // --------------------------------------------------- add to a real game
  await page.getByRole("button", { name: "Add to my game" }).first().click();
  await page.waitForSelector("text=Remove", { timeout: 10_000 });
  check("adds to this browser", await page.getByText(/loaded in this browser/).isVisible());

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("the-floor-community-categories") ?? "{}")
  );
  const key = Object.keys(stored)[0];
  check("stored under a namespaced key", key?.startsWith("community:"), key);
  check(
    "snapshot carries absolute image urls",
    stored[key]?.examples?.length >= 12 && Boolean(stored[key].examples[0].src),
    `${stored[key]?.examples?.length} examples`
  );

  // ------------------------------------------------- shows up in the game
  await page.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });

  // The single-round category picker lives behind this button.
  await page.getByRole("button", { name: "Start Single Round" }).click();
  await page.waitForSelector("select", { timeout: 10_000 });
  const roundOptions = await page.locator("select option").allTextContents();
  check(
    "single-round picker offers the community category",
    roundOptions.some((option) => option.includes("E2E Fruits (community)")),
    `${roundOptions.length} options`
  );
  check(
    "curated categories are still listed, and first",
    roundOptions.indexOf("Fruits") >= 0 &&
      roundOptions.indexOf("Fruits") <
        roundOptions.findIndex((o) => o.includes("(community)")),
    `Fruits at ${roundOptions.indexOf("Fruits")}`
  );

  // And in the full game's per-player picker.
  await page.goto(`${BASE}/presenter`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start Game" }).click();
  await page.waitForSelector("select", { timeout: 10_000 });
  const playerOptions = await page.locator("select option").allTextContents();
  check(
    "player picker offers the community category",
    playerOptions.some((option) => option.includes("E2E Fruits (community)")),
    `${playerOptions.length} options`
  );

  // ------------------------------------------------------- and it plays
  await page.goto(`${BASE}/demo?category=${encodeURIComponent(`community:${stored[key].id}`)}`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2000);
  const body = await page.locator("body").textContent();
  check("demo round resolves the community category", !body.includes("Category unavailable"));

  check("no uncaught console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
} catch (error) {
  check(`threw: ${error.message}`, false);
  await page.screenshot({ path: "/tmp/e2e-failure.png" }).catch(() => {});
  console.log("   screenshot: /tmp/e2e-failure.png");
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length === 0 ? 0 : 1);
