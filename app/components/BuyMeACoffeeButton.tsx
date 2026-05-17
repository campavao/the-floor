"use client";

import { usePathname } from "next/navigation";

const EXCLUDED_PREFIXES = ["/presenter", "/projector", "/demo"];
const BMC_URL = "https://buymeacoffee.com/campavao";

export default function BuyMeACoffeeButton() {
  const pathname = usePathname();
  const isExcluded = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );

  if (isExcluded) return null;

  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a coffee"
      className="fixed bottom-[18px] right-[18px] z-[9999] inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FFDD00] px-4 py-2 text-black shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
      style={{ fontFamily: "var(--font-cookie), cursive" }}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ☕
      </span>
      <span className="text-xl leading-none">Buy me a coffee</span>
    </a>
  );
}
