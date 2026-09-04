"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/data/collections";
import type { Category, CategorySlug } from "@/lib/types";
import { byCategory } from "@/lib/data/products";
import { Reveal, TextReveal, EASE } from "@/components/ui/motion";
import { ArrowRight } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* A curated eight rather than all thirteen — the home page introduces the
   range, the category pages carry it. Tiles sit on an uneven baseline so
   the rows scan as a spread rather than a grid of boxes. */

const FEATURED: CategorySlug[] = [
  "chains",
  "jumukkas",
  "earrings",
  "necklace",
  "cuff-bangles",
  "bangles",
  "anklets",
  "chokers",
];

const LAYOUT = [
  "lg:col-span-3 lg:mt-0",
  "lg:col-span-3 lg:mt-16",
  "lg:col-span-3 lg:mt-6",
  "lg:col-span-3 lg:mt-24",
];

const RATIO = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/5]"];

/* layout arrays are shorter than the tile list, so they cycle */
const layoutAt = (i: number) => LAYOUT[i % LAYOUT.length];
const ratioAt = (i: number) => RATIO[i % RATIO.length];

const tiles = FEATURED.map((slug) => categories.find((c) => c.slug === slug)).filter(
  (c): c is Category => Boolean(c),
);

export function Categories() {
  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-3/60" />
                <span className="eyebrow text-gold-3">By category</span>
              </div>
            </Reveal>
            <h2 className="display mt-5 text-[clamp(2rem,1.2rem+3.4vw,4.25rem)]">
              <TextReveal text="Find your way in" />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-[13.5px] leading-relaxed opacity-55">
              Forty-two pieces across two lines — steel you can swim in, and temple gold made the
              way Thrissur has always made it.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-12">
          {tiles.map((category, i) => (
            <motion.div
              key={category.slug}
              className={cn(layoutAt(i))}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.95, delay: i * 0.08, ease: EASE }}
            >
              <Link href={`/category/${category.slug}`} className="group block">
                <div className={cn("relative overflow-hidden bg-sand", ratioAt(i))}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 24vw"
                    className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                  />
                  {/* several of these frames are near-white studio shots, so the
                      scrim has to be strong enough to carry ivory type on any of them */}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent transition-opacity duration-700 group-hover:from-ink/88" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
                    <div>
                      <h3 className="display text-ivory text-2xl md:text-3xl">{category.name}</h3>
                      <p className="mt-1 text-[11.5px] text-ivory/60">
                        {byCategory(category.slug).length} pieces
                      </p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-ivory/35 text-ivory transition-all duration-500 group-hover:bg-ivory group-hover:text-ink">
                      <ArrowRight className="w-3.5" />
                    </span>
                  </div>
                </div>
                <p className="mt-3 hidden text-[12.5px] opacity-50 lg:block">{category.blurb}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
