"use client";

import Link from "next/link";
import FloorPageLayout from "../../components/FloorPageLayout";
import FloorButton from "../../components/FloorButton";

const REPO_URL = "https://github.com/campavao/the-floor";
const NEW_ISSUE_URL = `${REPO_URL}/issues/new`;
const COMPARE_URL = `${REPO_URL}/compare`;

const IMAGE_EXAMPLE_SNIPPET = `const SeaCreaturesCategory: CategoryMetadata = {
  name: "Sea Creatures",
  folder: "sea-creatures",
  examples: [
    {
      name: "Octopus",
      image: "octopus.png",
      alternatives: ["Octopi"],
    },
    // ...more entries
  ],
};`;

const TEXT_EXAMPLE_SNIPPET = `const FamousQuotesCategory: CategoryMetadata = {
  name: "Famous Quotes",
  folder: "famous-quotes",
  examples: [
    {
      name: "Neil Armstrong",
      text: "One small step for man...",
      alternatives: [],
    },
    // ...more entries
  ],
};`;

const REGISTER_SNIPPET = `// 1. Add to the Category union
export type Category =
  | "Pokemon"
  // ...
  | "Sea Creatures";

// 2. Register in CATEGORY_METADATA
export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
  // ...
  "Sea Creatures": SeaCreaturesCategory,
};`;

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-950 border-2 border-[#00d4ff]/40 rounded-md p-4 overflow-x-auto text-sm md:text-base">
      <code className="text-[#00d4ff] font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

export default function ContributeCategoriesPage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center p-8 md:p-20">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black metallic-text mb-4">
              ADD A CATEGORY
            </h1>
            <p className="text-xl md:text-2xl glow-text">
              Want to see your favorite trivia subject on The Floor? Open a pull
              request!
            </p>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                How It Works
              </h2>
              <p className="mb-4">
                Categories are defined directly in the source code. To add a new
                one, you&apos;ll fork the repo, add your images and data, and
                open a pull request. Once it&apos;s merged, your category goes
                live for everyone.
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Fork the repo on GitHub</li>
                <li>
                  Add your image files to{" "}
                  <code className="text-[#00d4ff] font-mono">
                    public/images/&lt;your-folder&gt;/
                  </code>
                </li>
                <li>
                  Add a category entry in{" "}
                  <code className="text-[#00d4ff] font-mono">app/data.ts</code>
                </li>
                <li>Open a pull request</li>
              </ol>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Step 1: Add Your Images
              </h2>
              <p className="mb-4">
                Drop your image files (PNG, JPG, or WEBP work best) into a new
                folder under{" "}
                <code className="text-[#00d4ff] font-mono">public/images/</code>
                . The folder name should be lowercase and kebab-case.
              </p>
              <CodeBlock>{`public/images/sea-creatures/
  octopus.png
  shark.png
  jellyfish.png`}</CodeBlock>
              <p className="mt-4 text-white/70 text-base">
                Tip: aim for transparent backgrounds and a roughly square aspect
                ratio so they look good in the grid.
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Step 2: Define the Category
              </h2>
              <p className="mb-4">
                In{" "}
                <code className="text-[#00d4ff] font-mono">app/data.ts</code>,
                create a new <code className="text-[#00d4ff] font-mono">CategoryMetadata</code>{" "}
                constant. Each example has a{" "}
                <code className="text-[#00d4ff] font-mono">name</code> (the
                answer), the asset (<code className="text-[#00d4ff] font-mono">image</code>{" "}
                filename or <code className="text-[#00d4ff] font-mono">text</code>{" "}
                string), and an{" "}
                <code className="text-[#00d4ff] font-mono">alternatives</code>{" "}
                array of acceptable alternate answers.
              </p>

              <p className="mt-4 mb-2 font-semibold" style={{ color: "#00d4ff" }}>
                Image-based category:
              </p>
              <CodeBlock>{IMAGE_EXAMPLE_SNIPPET}</CodeBlock>

              <p className="mt-4 mb-2 font-semibold" style={{ color: "#00d4ff" }}>
                Text-based category (no images needed):
              </p>
              <CodeBlock>{TEXT_EXAMPLE_SNIPPET}</CodeBlock>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Step 3: Register It
              </h2>
              <p className="mb-4">
                Add your category to the{" "}
                <code className="text-[#00d4ff] font-mono">Category</code> type
                union and the{" "}
                <code className="text-[#00d4ff] font-mono">
                  CATEGORY_METADATA
                </code>{" "}
                record at the bottom of the file.
              </p>
              <CodeBlock>{REGISTER_SNIPPET}</CodeBlock>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold mb-4 glow-text">
                Step 4: Open a Pull Request
              </h2>
              <p className="mb-4">
                Push your branch to your fork and open a PR against{" "}
                <code className="text-[#00d4ff] font-mono">main</code>. Include
                the category name and a short description of the examples in
                the PR body. We&apos;ll review and merge it in.
              </p>
              <p className="text-white/70 text-base">
                Not comfortable with code? Open an issue instead with your
                category idea and example list — we can take it from there.
              </p>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a href={COMPARE_URL} target="_blank" rel="noopener noreferrer">
              <FloorButton variant="rectangular">Open a Pull Request</FloorButton>
            </a>
            <a href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
              <FloorButton variant="rectangular">Suggest via Issue</FloorButton>
            </a>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Back to Categories</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
