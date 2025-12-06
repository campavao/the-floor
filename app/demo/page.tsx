"use client";
import { useSearchParams } from "next/navigation";
import { Category } from "../data";
import Round from "../projector/round";
import { Suspense } from "react";

export function Demo() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as Category | undefined;

  if (!category) {
    return <div>No category provided</div>;
  }

  return (
    <Round
      category={category}
      challenger={{
        person: "Challenger",
        category,
        hasPlayed: true,
        isStillInTheGame: true,
      }}
      defender={{
        person: "Defender",
        category,
        hasPlayed: true,
        isStillInTheGame: true,
      }}
      onFinish={() => {}}
    />
  );
}

export default function DemoPage({ params }: { params: Promise<any> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Demo />
    </Suspense>
  );
}
