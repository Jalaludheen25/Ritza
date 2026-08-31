"use client";

import { Marquee } from "@/components/ui/motion";

const CLAIMS = [
  "18k gold, never plated",
  "GIA certified stones",
  "Hand-finished in Al Quoz",
  "Complimentary sizing for life",
  "Insured worldwide delivery",
  "Gulf pearls, knotted on silk",
];

export function HouseStrip() {
  return (
    <div className="border-y border-ink/10 bg-ivory py-4">
      <Marquee speed={46}>
        {CLAIMS.map((c) => (
          <span key={c} className="flex items-center gap-8 pr-8">
            <span className="eyebrow whitespace-nowrap text-ink/55">{c}</span>
            {/* echoes the gold marks set into the logo */}
            <span aria-hidden className="block h-[5px] w-[5px] rotate-45 bg-gold" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
