"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Stars, Quantity, Accordion } from "@/components/ui/bits";
import { EASE } from "@/components/ui/motion";
import { TryOnModal } from "./TryOnModal";
import { collectionName } from "@/lib/data/collections";
import { useStore } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";

export function ProductInfo({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist, hydrated, pushRecent } = useStore();
  const params = useSearchParams();

  const [size, setSize] = useState<string | undefined>(product.sizes?.[2]);
  const [qty, setQty] = useState(1);
  const [engraving, setEngraving] = useState("");
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const engravable = product.specs.some((s) => s.label === "Engraving");
  const saved = hydrated && inWishlist(product.slug);

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  /* deep link from the home-page showcase and quick view */
  useEffect(() => {
    if (params.get("tryon") === "1" && product.tryOn) setTryOnOpen(true);
  }, [params, product.tryOn]);

  const submit = () => {
    addToCart({
      slug: product.slug,
      quantity: qty,
      size,
      engraving: engraving.trim() || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="lg:sticky lg:top-[110px]">
      <Link href={`/collections/${product.collection}`} className="eyebrow link-line text-gold-3">
        {collectionName(product.collection)}
      </Link>

      <h1 className="display mt-5 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)]">{product.name}</h1>
      <p className="mt-3 text-[14px] opacity-55">{product.tagline}</p>

      <div className="mt-5 flex items-center gap-3">
        <Stars rating={product.rating} className="text-gold-3" />
        <a href="#reviews" className="link-line text-[12.5px] opacity-55">
          {product.rating.toFixed(1)} · {product.reviewCount} reviews
        </a>
      </div>

      <p className="display mt-7 text-[2rem] tabular-nums">{formatPrice(product.price)}</p>
      <p className="mt-1.5 text-[12px] opacity-45">
        Includes VAT. Duties calculated at checkout.
      </p>

      <p className="lede mt-7">{product.description}</p>

      {/* size */}
      {product.sizes && (
        <div className="mt-9">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow text-[9px] opacity-60">Size</p>
            <Link href="/faq#sizing" className="link-line text-[12px] opacity-45">
              Sizing guide
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "h-11 min-w-[52px] border px-3 text-[13px] transition-colors duration-300",
                  size === s ? "border-ink bg-ink text-ivory" : "border-ink/18 hover:border-ink/50",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* engraving */}
      {engravable && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow text-[9px] opacity-60">Engraving — complimentary</p>
            <span className="text-[12px] opacity-40 tabular-nums">{engraving.length}/20</span>
          </div>
          <input
            value={engraving}
            maxLength={20}
            onChange={(e) => setEngraving(e.target.value)}
            placeholder="A word, a date, a coordinate"
            aria-label="Engraving"
            className="field mt-2"
          />
          <p className="mt-2 text-[12px] opacity-45">
            Hand-cut inside the band. Adds four working days, and makes the piece non-returnable.
          </p>
        </div>
      )}

      {/* actions */}
      <div className="mt-9 flex items-center gap-3">
        <Quantity value={qty} onChange={setQty} />
        <Button variant="ink" className="flex-1" onClick={submit}>
          {added ? "Added to bag" : product.inStock ? "Add to bag" : "Order to make"}
        </Button>
      </div>

      <div className="mt-3 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={saved}
        >
          {saved ? "Saved" : "Add to wishlist"}
        </Button>
        {product.tryOn && (
          <Button variant="outline" className="flex-1" onClick={() => setTryOnOpen(true)}>
            <span className="mr-1 block h-[5px] w-[5px] rotate-45 bg-gold" />
            Try it on
          </Button>
        )}
      </div>

      {added && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="eyebrow mt-4 text-[9px] text-gold-3"
        >
          {product.name} added — {formatPrice(product.price * qty)}
        </motion.p>
      )}

      {/* assurances */}
      <ul className="mt-8 space-y-2.5 border-t border-ink/10 pt-7 text-[13px] opacity-60">
        <li className="flex gap-3">
          <span className="text-gold-3">—</span>
          {product.inStock
            ? "In stock — dispatched the same working day"
            : "Made to order — eight to fourteen weeks"}
        </li>
        <li className="flex gap-3">
          <span className="text-gold-3">—</span>
          Free delivery over AED 200, same day across Dubai
        </li>
        <li className="flex gap-3">
          <span className="text-gold-3">—</span>
          Thirty-day returns, free sizing and restringing for life
        </li>
      </ul>

      {/* detail */}
      <Accordion
        className="mt-10"
        items={[
          {
            title: "Specification",
            content: (
              <dl className="divide-y divide-ink/8">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 py-2.5">
                    <dt className="shrink-0 opacity-55">{s.label}</dt>
                    <dd className="text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
          { title: "From the workshop", content: <p>{product.detail}</p> },
          {
            title: "Care",
            content: (
              <p>
                Anti-Tarnish pieces need nothing: shower, swim and sweat in them, then wipe dry.
                Kerala Traditional plating is more delicate — keep it away from perfume, put it on
                last and take it off first, and store it in the pouch rather than loose in a drawer.
              </p>
            ),
          },
          {
            title: "Delivery & returns",
            content: (
              <p>
                Free over AED 200 — same day in Dubai, next working day across the UAE, two to five
                days in the GCC. Thirty days to return anything unworn in its original box. Pierced
                items cannot be returned once the hygiene seal is broken.
              </p>
            ),
          },
        ]}
      />

      <p className="mt-8 text-[13px] opacity-55">
        Questions about this piece?{" "}
        <Link href="/contact" className="link-line">
          Speak to the workshop
        </Link>
        .
      </p>

      {product.tryOn && (
        <TryOnModal product={product} open={tryOnOpen} onClose={() => setTryOnOpen(false)} />
      )}
    </div>
  );
}
