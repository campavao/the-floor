import React from "react";

interface FloorPageLayoutProps {
  children: React.ReactNode;
}

export default function FloorPageLayout({ children }: FloorPageLayoutProps) {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-x-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none"></div>
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}
