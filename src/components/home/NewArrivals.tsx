"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { SectionHeading } from "@/components/ui/bits";
import { TextLink, ArrowRight } from "@/components/ui/Button";
import { Reveal, EASE } from "@/components/ui/motion";
import { products } from "@/lib/data/products";

/* A rail rather than a grid — new pieces arrive in sequence, and the
   overflow to the right is the point. Drag on desktop, swipe on touch. */

export function NewArrivals() {
  const railRef = useRef<HTMLDivElement>(null);
  const [quick, setQuick] = useState<Product | null>(null);

  const items = [
    ...products.filter((p) => p.badges.includes("new")),
    ...products.filter((p) => !p.badges.includes("new")).slice(0, 4),
  ].slice(0, 8);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(560, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Just arrived"
          title={
            <>
              New this <em className="font-normal italic">season</em>
            </>
          }
          action={
            <div className="flex items-center gap-6">
              <TextLink href="/shop?sort=newest" className="hidden sm:inline-block">
                View all
              </TextLink>
              <div className="hidden items-center gap-2 md:flex">
                <RailButton dir={-1} onClick={() => nudge(-1)} />
                <RailButton dir={1} onClick={() => nudge(1)} />
              </div>
            </div>
          }
        />
      </div>

      <Reveal delay={0.1} className="mt-12">
        <div
          ref={railRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:gap-6 md:px-10 xl:px-16"
        >
          {items.map((product, i) => (
            <div
              key={product.slug}
              className="w-[68vw] shrink-0 snap-start sm:w-[42vw] md:w-[32vw] lg:w-[25vw] xl:w-[21vw]"
            >
              <ProductCard
                product={product}
                index={i}
                onQuickView={setQuick}
                sizes="(max-width: 640px) 68vw, (max-width: 1024px) 32vw, 21vw"
              />
            </div>
          ))}

          <motion.div
            className="flex w-[52vw] shrink-0 snap-start items-center sm:w-[30vw] lg:w-[18vw]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <TextLink href="/shop" className="flex items-center gap-3 text-gold-3">
              Shop everything
              <ArrowRight />
            </TextLink>
          </motion.div>
        </div>
      </Reveal>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}

function RailButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next pieces" : "Previous pieces"}
      className="grid h-10 w-10 place-items-center border border-ink/15 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory"
    >
      <ArrowRight className={dir === -1 ? "rotate-180" : undefined} />
    </button>
  );
}
