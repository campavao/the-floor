"use client";

import FloorPageLayout from "./components/FloorPageLayout";
import FloorButton from "./components/FloorButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <FloorPageLayout>
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8 md:p-20">
        <div className="max-w-3xl w-full flex flex-col items-center text-center gap-10">
          <div>
            <h1 className="text-6xl md:text-8xl font-black metallic-text mb-4">
              THE FLOOR
            </h1>
            <p className="text-2xl md:text-3xl glow-text">
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
            <Link href="/about" prefetch={false}>
              <FloorButton variant="rectangular">About This Game</FloorButton>
            </Link>
          </div>
        </div>
      </div>
    </FloorPageLayout>
  );
}
