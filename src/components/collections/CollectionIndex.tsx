"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { collections } from "@/lib/data/collections";
import { byCollection } from "@/lib/data/products";
import { EASE } from "@/components/ui/motion";
import { Gloss } from "@/components/ui/bits";
import { ArrowRight } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* Desktop reads as an index: five names, and the cover of whichever one you
   are pointing at trails the cursor. Touch gets plain cards instead. */

export function CollectionIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 140, damping: 20, mass: 0.5 });
  const y = useSpring(my, { stiffness: 140, damping: 20, mass: 0.5 });

  return (
    <>
      {/* desktop index */}
      <div
        ref={listRef}
        className="relative hidden lg:block"
        onPointerMove={(e) => {
          const r = listRef.current?.getBoundingClientRect();
          if (!r) return;
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <div className="border-t border-ink/10">
          {collections.map((c, i) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              onMouseEnter={() => setHovered(i)}
              className="group relative block border-b border-ink/10"
            >
              <div className="shell flex items-center justify-between gap-8 py-9">
                <div className="flex items-baseline gap-8">
                  <span className="eyebrow w-8 shrink-0 text-[9px] text-ink/30 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className={cn(
                      "display text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      hovered !== null && hovered !== i ? "opacity-25" : "opacity-100",
                      "group-hover:translate-x-3",
                    )}
                  >
                    {c.name}
                  </h2>
                  <Gloss arabic={c.arabic} meaning={c.meaning} className="text-ink/35" />
                </div>

                <div className="flex shrink-0 items-center gap-10">
                  <p className="max-w-xs text-right text-[13px] leading-relaxed opacity-50">
                    {c.tagline}
                  </p>
                  <span className="eyebrow text-[9px] text-ink/35 tabular-nums">
                    {byCollection(c.slug).length} pieces
                  </span>
                  <span className="grid h-10 w-10 place-items-center border border-ink/15 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <ArrowRight className="w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* trailing cover */}
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-20 hidden xl:block"
          style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        >
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                key={collections[hovered].slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative h-[340px] w-[260px] overflow-hidden bg-sand shadow-[0_30px_70px_-30px_rgba(6,16,39,0.5)]"
              >
                <Image
                  src={collections[hovered].cover}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* touch cards */}
      <div className="shell grid gap-8 pb-4 sm:grid-cols-2 lg:hidden">
        {collections.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
          >
            <Link href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={c.cover}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[1100ms] group-active:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h2 className="display text-ivory text-4xl">{c.name}</h2>
                  <p className="mt-1.5 text-[12.5px] text-ivory/65">{c.tagline}</p>
                </div>
              </div>
              <p className="mt-3 text-[12.5px] opacity-50">
                {byCollection(c.slug).length} pieces — since {c.year}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}
