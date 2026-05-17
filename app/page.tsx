"use client";

import FloorPageLayout from "./components/FloorPageLayout";
import FloorButton from "./components/FloorButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center p-8 md:p-20">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-black metallic-text mb-4">
              THE FLOOR
            </h1>
            <p className="text-2xl md:text-3xl glow-text mb-4">
              Fan-Made Online Game
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/presenter" prefetch={false}>
              <FloorButton variant="rectangular">Start Playing</FloorButton>
            </Link>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Browse Categories</FloorButton>
            </Link>
          </div>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                About This Game
              </h2>
              <p className="mb-4">
                This is a{" "}
                <strong className="glow-text">fan-made, unofficial</strong>{" "}
                online version of the hit Fox game show <em>The Floor</em>,
                hosted by Rob Lowe. Created by a fan of the show, this web-based
                game allows you to experience the excitement of The Floor from
                your browser.
              </p>
              <p className="mb-4">
                Play with friends, challenge opponents in trivia duels, and
                compete to control the entire floor—just like on the show!
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                How to Play
              </h2>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Set Up Your Game:</strong> Go to the presenter page
                  and add players with their unique categories.
                </li>
                <li>
                  <strong>Start the Game:</strong> Click &ldquo;Start Game&rdquo;
                  to begin playing.
                </li>
                <li>
                  <strong>Challenge Opponents:</strong> Players take turns
                  challenging each other in head-to-head trivia duels.
                </li>
                <li>
                  <strong>Win Territory:</strong> The winner of each duel takes
                  control of the loser&apos;s territory.
                </li>
                <li>
                  <strong>Conquer the Floor:</strong> Be the last player
                  standing to win!
                </li>
              </ol>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                Support the Project
              </h2>
              <p className="mb-4">
                The Floor: The Game is completely free to play. If you&apos;re
                enjoying it and want to help cover hosting costs, you can tip
                the project via Buy Me a Coffee — every bit helps keep the
                lights on.
              </p>
              <p>
                Tap the{" "}
                <strong className="glow-text">Buy me a coffee</strong> button in
                the bottom-right corner of the page, or visit{" "}
                <a
                  href="https://buymeacoffee.com/campavao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline glow-text"
                >
                  buymeacoffee.com/campavao
                </a>
                .
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                Disclaimer
              </h2>
              <p className="mb-4">
                <em>The Floor</em> is a trademark of Fox Broadcasting Company.
                This game is an independent, fan-created project and is not
                affiliated with, endorsed by, or associated with Fox
                Broadcasting Company, Rob Lowe, or any official The Floor
                production.
              </p>
              <p>
                This game is provided for entertainment purposes only and is
                completely free to play. No commercial use is intended.
              </p>
            </section>

            <section className="bg-black/60 p-6 md:p-8 border-2 border-white/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
                About The Show
              </h2>
              <p className="mb-4">
                <em>The Floor</em> is an American game show based on the Dutch
                game show of the same name. The series is hosted by Rob Lowe and
                premiered on January 2, 2024, on Fox.
              </p>
              <p>
                Contestants with expertise in various trivia subjects challenge
                each other in head-to-head duels, with the winner taking over
                all territory controlled by the loser. The contestant who gains
                full control over the Floor wins $250,000.
              </p>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/presenter" prefetch={false}>
              <FloorButton variant="rectangular">Start Playing</FloorButton>
            </Link>
            <Link href="/categories" prefetch={false}>
              <FloorButton variant="rectangular">Browse Categories</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
