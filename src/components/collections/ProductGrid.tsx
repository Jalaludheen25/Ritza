"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { cn } from "@/lib/utils";

/** Plain grid with quick view wired up, for collection and account pages. */
export function ProductGrid({
  pieces,
  className,
  columns = 4,
}: {
  pieces: Product[];
  className?: string;
  columns?: 3 | 4;
}) {
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6",
          columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          className,
        )}
      >
        {pieces.map((p, i) => (
          <ProductCard
            key={p.slug}
            product={p}
            index={i}
            onQuickView={setQuick}
            sizes={
              columns === 4
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 24vw"
                : "(max-width: 640px) 50vw, 32vw"
            }
          />
        ))}
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
