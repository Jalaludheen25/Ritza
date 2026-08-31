"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { SectionHeading } from "@/components/ui/bits";
import { TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/motion";
import { getProduct, getProducts } from "@/lib/data/products";
import { cn } from "@/lib/utils";

/* One piece takes half the spread; four more sit beside it in two columns,
   the right-hand one dropped a step so the block never resolves into a
   straight line. Curated by slug so the lead is always worth enlarging. */

const LEAD = "noor-riviere-necklace";
const SUPPORT = [
  "dune-hoop-earrings",
  "dune-curb-chain",
  "noor-solitaire-studs",
  "dune-link-bracelet",
];

export function BestSellers() {
  const [quick, setQuick] = useState<Product | null>(null);
  const lead = getProduct(LEAD)!;
  const support = getProducts(SUPPORT);

  return (
    <section className="bg-ivory-2 py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Most worn"
          title={
            <>
              The pieces that <em className="font-normal italic">keep</em> leaving
            </>
          }
          action={<TextLink href="/shop?edit=bestsellers">All best sellers</TextLink>}
        />

        <div className="mt-12 grid gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-6" y={34}>
            <ProductCard
              product={lead}
              reveal={false}
              aspect="wide"
              onQuickView={setQuick}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>

          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:col-span-6">
            {support.map((product, i) => (
              <div key={product.slug} className={cn(i % 2 === 1 && "lg:mt-14")}>
                <ProductCard
                  product={product}
                  index={i + 1}
                  onQuickView={setQuick}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 24vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}
