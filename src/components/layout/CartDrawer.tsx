"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { Quantity } from "@/components/ui/bits";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { lockScroll } from "./SmoothScroll";

const FREE_SHIPPING = 2500;

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, setQuantity, subtotal } = useStore();

  useEffect(() => {
    lockScroll(cartOpen);
    return () => lockScroll(false);
  }, [cartOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  const progress = Math.min(1, subtotal / FREE_SHIPPING);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[105] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[106] flex w-full max-w-[440px] flex-col bg-ivory"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-ink/10 px-6 py-5">
              <p className="eyebrow">
                Shopping bag{cart.length > 0 ? ` (${cart.length})` : ""}
              </p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
                className="grid h-8 w-8 place-items-center transition-opacity hover:opacity-55"
              >
                <span className="relative block h-3.5 w-3.5">
                  <span className="absolute top-1/2 left-0 h-px w-3.5 rotate-45 bg-ink" />
                  <span className="absolute top-1/2 left-0 h-px w-3.5 -rotate-45 bg-ink" />
                </span>
              </button>
            </header>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
                <p className="display text-3xl">Your bag is empty</p>
                <p className="lede mt-4 text-[14px]">
                  Nothing chosen yet. The house signature is a good place to start.
                </p>
                <ButtonLink
                  href="/shop"
                  variant="ink"
                  className="mt-8"
                  onClick={() => setCartOpen(false)}
                >
                  Browse the collection
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="shrink-0 border-b border-ink/10 px-6 py-4">
                  <p className="text-[12px] tracking-wide">
                    {progress >= 1 ? (
                      <span className="text-gold-3">Insured delivery is on us</span>
                    ) : (
                      <>
                        {formatPrice(FREE_SHIPPING - subtotal)} more for complimentary insured
                        delivery
                      </>
                    )}
                  </p>
                  <div className="mt-2.5 h-px w-full bg-ink/10">
                    <motion.span
                      className="block h-full origin-left bg-gold"
                      initial={false}
                      animate={{ scaleX: progress }}
                      transition={{ duration: 0.7, ease: EASE }}
                    />
                  </div>
                </div>

                <div className="hide-scrollbar flex-1 overflow-y-auto overscroll-contain px-6">
                  <ul>
                    <AnimatePresence initial={false}>
                      {cart.map((line) => {
                        const product = getProduct(line.slug);
                        if (!product) return null;
                        return (
                          <motion.li
                            key={`${line.slug}-${line.size ?? ""}`}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden border-b border-ink/8"
                          >
                            <div className="flex gap-4 py-5">
                              <Link
                                href={`/product/${product.slug}`}
                                onClick={() => setCartOpen(false)}
                                className="relative aspect-[3/4] w-[88px] shrink-0 overflow-hidden bg-sand"
                              >
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  sizes="88px"
                                  className="object-cover"
                                />
                              </Link>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <Link
                                      href={`/product/${product.slug}`}
                                      onClick={() => setCartOpen(false)}
                                      className="block truncate text-[14.5px]"
                                    >
                                      {product.name}
                                    </Link>
                                    <p className="mt-1 text-[12px] opacity-50">
                                      {product.tagline}
                                      {line.size ? ` · Size ${line.size}` : ""}
                                    </p>
                                    {line.engraving && (
                                      <p className="mt-1 text-[12px] text-gold-3">
                                        Engraved “{line.engraving}”
                                      </p>
                                    )}
                                  </div>
                                  <p className="shrink-0 text-[13.5px] tabular-nums">
                                    {formatPrice(product.price * line.quantity)}
                                  </p>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-4">
                                  <Quantity
                                    value={line.quantity}
                                    onChange={(v) => setQuantity(line.slug, line.size, v)}
                                    className="scale-90 origin-left"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(line.slug, line.size)}
                                    className="link-line eyebrow text-[9px] opacity-45"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="shrink-0 border-t border-ink/10 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <p className="eyebrow">Subtotal</p>
                    <p className="display text-2xl tabular-nums">{formatPrice(subtotal)}</p>
                  </div>
                  <p className="mt-2 text-[12px] opacity-50">
                    Duties and taxes calculated at checkout.
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <ButtonLink
                      href="/checkout"
                      variant="ink"
                      className="w-full"
                      onClick={() => setCartOpen(false)}
                    >
                      Proceed to checkout
                    </ButtonLink>
                    <ButtonLink
                      href="/cart"
                      variant="outline"
                      className="w-full"
                      onClick={() => setCartOpen(false)}
                    >
                      View bag
                    </ButtonLink>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
