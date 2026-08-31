"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/bits";
import { EASE } from "@/components/ui/motion";

/* The unit the whole shop is built from. Second frame cross-fades in on
   hover, wishlist sits top-right, quick view rises from the bottom edge. */

export function ProductCard({
  product,
  index = 0,
  onQuickView,
  priority,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
  reveal = true,
  aspect = "portrait",
}: {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
  sizes?: string;
  className?: string;
  reveal?: boolean;
  aspect?: "portrait" | "tall" | "wide";
}) {
  const { toggleWishlist, inWishlist, hydrated } = useStore();
  const [hovered, setHovered] = useState(false);
  const saved = hydrated && inWishlist(product.slug);
  const second = product.images[1] ?? product.images[0];
  const ratio =
    aspect === "tall" ? "aspect-[2/3]" : aspect === "wide" ? "aspect-[4/5]" : "aspect-[3/4]";

  return (
    <motion.article
      className={cn("group relative", className)}
      initial={reveal ? { opacity: 0, y: 30 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay: Math.min(index, 5) * 0.07, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn("relative overflow-hidden bg-sand", ratio)}>
        <Link href={`/product/${product.slug}`} className="relative block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              hovered ? "scale-105 opacity-0" : "scale-100 opacity-100",
            )}
          />
          <Image
            src={second}
            alt=""
            fill
            sizes={sizes}
            aria-hidden
            className={cn(
              "object-cover transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              hovered ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          />
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.badges.includes("new") && <Badge tone="ivory">New</Badge>}
          {product.badges.includes("limited") && <Badge tone="gold">Limited</Badge>}
          {product.badges.includes("bestseller") && !product.badges.includes("new") && (
            <Badge tone="ivory">Best seller</Badge>
          )}
          {!product.inStock && <Badge tone="ink">Made to order</Badge>}
        </div>

        {/* wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={saved}
          className={cn(
            "absolute top-2.5 right-2.5 grid h-9 w-9 place-items-center transition-all duration-500",
            "bg-ivory/85 backdrop-blur-sm md:opacity-0 md:group-hover:opacity-100",
            saved && "md:opacity-100",
          )}
        >
          <svg width="15" height="15" viewBox="0 0 18 18" aria-hidden>
            <path
              d="M9 15.4S2.2 11.3 2.2 6.9A3.7 3.7 0 0 1 9 4.9a3.7 3.7 0 0 1 6.8 2c0 4.4-6.8 8.5-6.8 8.5Z"
              fill={saved ? "var(--color-gold)" : "none"}
              stroke={saved ? "var(--color-gold)" : "currentColor"}
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* quick view */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 hidden overflow-hidden md:block">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className={cn(
                "eyebrow w-full bg-ivory/92 py-3.5 text-[9px] backdrop-blur-sm",
                "translate-y-full transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:translate-y-0 hover:bg-ink hover:text-ivory",
              )}
            >
              Quick view
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3 className="truncate text-[14.5px] leading-snug">
            <Link href={`/product/${product.slug}`} className="link-line">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 truncate text-[12.5px] opacity-50">{product.tagline}</p>
        </div>
        <p className="shrink-0 text-[13.5px] tabular-nums">{formatPrice(product.price)}</p>
      </div>
    </motion.article>
  );
}
