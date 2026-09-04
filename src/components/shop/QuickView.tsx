"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { collectionName } from "@/lib/data/collections";
import { useStore } from "@/lib/store";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Stars, Quantity } from "@/components/ui/bits";
import { EASE } from "@/components/ui/motion";
import { lockScroll } from "@/components/layout/SmoothScroll";
import { Portal } from "@/components/ui/Portal";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [frame, setFrame] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setFrame(0);
      setSize(product.sizes?.[2]);
      setQty(1);
    }
  }, [product]);

  useEffect(() => {
    lockScroll(!!product);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [product, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[105] bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-[106] grid place-items-center p-4">
            <motion.div
              role="dialog"
              aria-label={`${product.name} quick view`}
              className="pointer-events-auto grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-ivory md:grid-cols-2"
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.99 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div className="relative aspect-[4/5] bg-sand md:aspect-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={frame}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <Image
                      src={product.images[frame]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setFrame(i)}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        "h-1 w-7 transition-colors duration-500",
                        i === frame ? "bg-ivory" : "bg-ivory/40",
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="relative flex flex-col p-6 md:p-9">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close quick view"
                  className="absolute top-5 right-5 grid h-8 w-8 place-items-center transition-opacity hover:opacity-55"
                >
                  <span className="relative block h-3.5 w-3.5">
                    <span className="absolute top-1/2 left-0 h-px w-3.5 rotate-45 bg-ink" />
                    <span className="absolute top-1/2 left-0 h-px w-3.5 -rotate-45 bg-ink" />
                  </span>
                </button>

                <p className="eyebrow text-gold-3">{collectionName(product.collection)}</p>
                <h2 className="display mt-3 text-[2rem] leading-none">{product.name}</h2>
                <p className="mt-2 text-[13px] opacity-55">{product.tagline}</p>

                <div className="mt-4 flex items-center gap-3">
                  <Stars rating={product.rating} className="text-gold-3" />
                  <span className="text-[12px] opacity-50">
                    {product.rating.toFixed(1)} · {product.reviewCount} reviews
                  </span>
                </div>

                <p className="display mt-5 text-2xl tabular-nums">{formatPrice(product.price)}</p>
                <p className="lede mt-4 text-[13.5px]">{product.description}</p>

                {product.sizes && (
                  <div className="mt-6">
                    <p className="eyebrow mb-3 text-[9px] opacity-60">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={cn(
                            "h-10 min-w-[46px] border px-3 text-[12.5px] transition-colors duration-300",
                            size === s
                              ? "border-ink bg-ink text-ivory"
                              : "border-ink/18 hover:border-ink/45",
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <Quantity value={qty} onChange={setQty} />
                  <Button
                    variant="ink"
                    className="flex-1"
                    onClick={() => {
                      addToCart({ slug: product.slug, quantity: qty, size });
                      onClose();
                    }}
                  >
                    Add to bag
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.slug)}
                    className="eyebrow link-line text-[9px] opacity-60"
                  >
                    {inWishlist(product.slug) ? "Saved" : "Save to wishlist"}
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="eyebrow link-line text-[9px] text-gold-3"
                  >
                    Full details
                  </Link>
                </div>

                {product.tryOn && (
                  <ButtonLink
                    href={`/product/${product.slug}?tryon=1`}
                    variant="outline"
                    size="sm"
                    className="mt-5 w-full"
                    onClick={onClose}
                  >
                    Try it on
                  </ButtonLink>
                )}
              </div>
            </motion.div>
          </div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
