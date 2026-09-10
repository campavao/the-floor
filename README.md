# The Floor

A fan-made, unofficial browser version of the Fox game show *The Floor*.

Everyone starts on one tile of a grid, each defending a category they picked.
You challenge a neighbour, you both get 45 seconds on their subject, and the
winner takes their territory. Keep winning and you take the whole floor.

Play it at **[the-floor-game.vercel.app](https://the-floor-game.vercel.app)**, or run it
yourself:

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## The two screens

This is the part that isn't obvious. The game runs as **two pages at once**:

| Page | Who looks at it | What it does |
| --- | --- | --- |
| `/presenter` | you, the host | the floor grid, player list, who challenges who, scoring |
| `/projector` | everyone else | the big dramatic screen — images, timers, the countdown |

They stay in sync over `BroadcastChannel`, which means **both windows must be
in the same browser on the same machine.** Open two windows and drag the
projector one onto the TV. Two separate devices will not talk to each other.

Just want a look around first? `/demo` runs a game on its own, and
`/categories` browses every category and its answers.

## Adding a category

This is most of what lands in this repo, and it's two steps.

**1. Drop your images in a new folder** under `public/images/`, named in
lowercase kebab-case:

```
public/images/sea-creatures/
  octopus.png
  shark.png
  jellyfish.png
```

Square-ish images with transparent backgrounds look best in the grid.

Don't worry about file size — drop the originals in and run:

```bash
node scripts/optimize-images.mjs
```

It caps the longest edge at 2048px and re-encodes in place, keeping filenames
and formats. 2048 is chosen so the projector never has to upscale on a 1080p
screen. `npm test` fails if an oversized image slips through.

**2. Register it in `app/data.ts`** — a `CategoryMetadata` const, the name
added to the `Category` union, and an entry in `CATEGORY_METADATA`. Copy a
neighbouring category; the shape is short:

```ts
const SeaCreaturesCategory: CategoryMetadata = {
  name: "Sea Creatures",
  folder: "sea-creatures",
  examples: [
    { name: "Octopus", image: "octopus.png", alternatives: ["Squid"] },
  ],
};
```

`name` is the answer, `alternatives` are the other things you'll accept when a
player shouts something close enough. Categories can use `text:` instead of
`image:` if they're word or number prompts — see `Math`.

There's a walkthrough with more detail at `/categories/contribute`.

### One trap worth knowing about

**Filenames are case-sensitive in production.** Vercel builds on Linux;
Windows and macOS don't care about case, so `folder: "fruits"` pointing at
`public/images/Fruits/` looks perfect on your laptop and shows 51 broken
images to everyone else. This has already happened once.

`npm test` catches it before you push, on any operating system.

## Checks

```bash
npm test        # category data + image assets: refs resolve, files decode, nothing oversized
npm run build   # production build
```

CI runs both on every pull request, deliberately on Linux so casing bugs
surface there instead of in production.

## Community categories

Adding a category the way above means a pull request, which is the right
amount of friction for the built-in set. For everyone else there's
`/community` — name a category, get a list of items suggested for you, pick a
picture for each one in a grid, crop or erase watermarks, publish.

Those live outside the repo and nobody reviews them before they appear, so
they're kept in their own pool, ranked by votes and hidden when reported. Hosts
opt into the ones they want and they show up in the presenter's category list
alongside the built-in ones.

It runs locally with no accounts and no keys — see
[COMMUNITY_SETUP.md](COMMUNITY_SETUP.md) for that and for wiring up storage,
a database and item suggestions.

## Built with

Next.js and Tailwind, deployed on Vercel. The game itself has no database, no
accounts and no server — every page is static and the game state lives in your
browser. The community tool adds Postgres for the category list, Cloudflare R2
for the images, and the AI Gateway for item suggestions; without those
configured, the rest of the site is unaffected.

## Disclaimer

*The Floor* is a trademark of Fox Broadcasting Company. This is an
independent fan project, not affiliated with or endorsed by Fox, Rob Lowe, or
anyone involved in the actual show. Free to play, no commercial use intended.

If it's fun and you want to chip in for hosting:
[buymeacoffee.com/campavao](https://buymeacoffee.com/campavao).
