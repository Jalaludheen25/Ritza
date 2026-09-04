"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, TextReveal, EASE } from "@/components/ui/motion";
import { Button, TextLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/data/products";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";

/* One styled look, three pieces, marked on the photograph itself. Tap a
   marker to bring its piece forward; add the set in a single action. */

const LOOK = [
  { slug: "malabar-jumukka", x: 68, y: 41, label: "On the ear" },
  { slug: "attiyal-gold-choker", x: 58, y: 54, label: "At the throat" },
  { slug: "palakka-ornate-bangle", x: 19, y: 80, label: "On the wrist" },
];

export function CompleteLook() {
  const pieces = getProducts(LOOK.map((l) => l.slug));
  const [active, setActive] = useState(0);
  const { addToCart } = useStore();

  const total = pieces.reduce((sum, p) => sum + p.price, 0);

  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* the look */}
          <Reveal className="lg:col-span-5" y={36}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-2">
              <Image
                src="/images/kt-choker-bride.jpg"
                alt="A complete Kerala Traditional look — jumukka, attiyal choker and palakka kada"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />

              {LOOK.map((spot, i) => (
                <button
                  key={spot.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-label={`${pieces[i]?.name} — ${spot.label}`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span className="relative grid h-7 w-7 place-items-center">
                    {active === i && (
                      <motion.span
                        layoutId="look-ring"
                        className="absolute inset-0 rounded-full border border-ivory"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                    <span
                      className={cn(
                        "block h-2 w-2 rounded-full transition-colors duration-500",
                        active === i ? "bg-gold" : "bg-ivory/90",
                      )}
                    />
                    {active !== i && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-ivory/25 [animation-duration:3s]" />
                    )}
                  </span>
                </button>
              ))}

              {/* floating card for the active piece */}
              <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[260px]">
                <AnimatePresence mode="wait">
                  {pieces[active] && (
                    <motion.div
                      key={pieces[active].slug}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="pointer-events-auto flex items-center gap-3 bg-ivory/92 p-2.5 backdrop-blur-sm"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-sand">
                        <Image
                          src={pieces[active].images[0]}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="eyebrow text-[9px] text-gold-3">{LOOK[active].label}</p>
                        <Link
                          href={`/product/${pieces[active].slug}`}
                          className="mt-1 block truncate text-[13.5px]"
                        >
                          {pieces[active].name}
                        </Link>
                        <p className="mt-0.5 text-[12px] opacity-55">
                          {formatPrice(pieces[active].price)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* the set */}
          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-3/60" />
                <span className="eyebrow text-gold-3">Complete your look</span>
              </div>
            </Reveal>

            <h2 className="display mt-6 text-[clamp(2rem,1.3rem+3vw,3.5rem)]">
              <TextReveal text="The bridal set, worn together" />
            </h2>

            <Reveal delay={0.12}>
              <p className="lede mt-6">
                Three pieces in the same temple finish, cast from dies cut by the same hand in
                Thrissur. Bought together or one at a time.
              </p>
            </Reveal>

            <Reveal delay={0.18} className="mt-8">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {pieces.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500",
                          active === i ? "bg-gold" : "bg-ink/20",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px]">{p.name}</span>
                        <span className="mt-0.5 block truncate text-[12px] opacity-50">
                          {p.tagline}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] tabular-nums opacity-70">
                        {formatPrice(p.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.24} className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">The three together</p>
                <p className="display text-2xl tabular-nums">{formatPrice(total)}</p>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button
                  variant="ink"
                  onClick={() =>
                    pieces.forEach((p, i) =>
                      addToCart(
                        { slug: p.slug, quantity: 1, size: p.sizes?.[2] },
                        { silent: i < pieces.length - 1 },
                      ),
                    )
                  }
                >
                  Add all three
                </Button>
                <TextLink href="/collections/kerala-traditional">See the collection</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
