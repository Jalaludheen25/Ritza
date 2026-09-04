"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getProduct, products } from "@/lib/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Quantity } from "@/components/ui/bits";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { EASE, Reveal } from "@/components/ui/motion";

export const FREE_SHIPPING = 200;
export const VAT_RATE = 0.05;

/** Mock promotion codes — the checkout has no server to validate against. */
const CODES: Record<string, { off: number; label: string }> = {
  RITZA10: { off: 0.1, label: "10% — house welcome" },
  BAZAAR: { off: 0.15, label: "15% — Meena Bazaar welcome" },
};

export function CartView() {
  const { cart, setQuantity, removeFromCart, subtotal, hydrated } = useStore();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; off: number; label: string } | null>(null);
  const [codeError, setCodeError] = useState("");

  const discount = applied ? Math.round(subtotal * applied.off) : 0;
  const afterDiscount = subtotal - discount;
  const delivery = afterDiscount >= FREE_SHIPPING || afterDiscount === 0 ? 0 : 20;
  const total = afterDiscount + delivery;
  const vat = Math.round(total - total / (1 + VAT_RATE));

  const applyCode = () => {
    const key = code.trim().toUpperCase();
    const match = CODES[key];
    if (!match) {
      setCodeError("That code is not recognised.");
      setApplied(null);
      return;
    }
    setCodeError("");
    setApplied({ code: key, ...match });
  };

  if (!hydrated) return <div className="shell min-h-[50vh] py-20" />;

  if (cart.length === 0) {
    return (
      <div className="shell py-16">
        <div className="border-y border-ink/10 py-24 text-center">
          <p className="display text-[clamp(2rem,1.4rem+2.4vw,3.5rem)]">Your bag is empty</p>
          <p className="lede mx-auto mt-5 max-w-md">
            Nothing chosen yet. Start with the pieces that leave the workshop fastest.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" variant="ink">
              Browse the collection
            </ButtonLink>
            <ButtonLink href="/collections" variant="outline">
              See the collections
            </ButtonLink>
          </div>
        </div>

        <div className="mt-20">
          <p className="eyebrow text-gold-3">Most worn this month</p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {products
              .filter((p) => p.badges.includes("bestseller"))
              .slice(0, 4)
              .map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* lines */}
        <div className="lg:col-span-7">
          <div className="flex items-baseline justify-between border-b border-ink/10 pb-4">
            <p className="eyebrow">
              {cart.length} {cart.length === 1 ? "piece" : "pieces"}
            </p>
            <p className="eyebrow text-ink/40">Price</p>
          </div>

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
                    className="overflow-hidden border-b border-ink/10"
                  >
                    <div className="flex gap-5 py-7">
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative aspect-[3/4] w-[110px] shrink-0 overflow-hidden bg-sand md:w-[132px]"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="132px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              href={`/product/${product.slug}`}
                              className="link-line text-[15.5px]"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-1.5 text-[12.5px] opacity-50">{product.tagline}</p>
                            <div className="mt-2.5 space-y-1 text-[12.5px] opacity-60">
                              {line.size && <p>Size {line.size}</p>}
                              {line.engraving && (
                                <p className="text-gold-3">Engraved “{line.engraving}”</p>
                              )}
                              <p>
                                {product.inStock
                                  ? "In stock — dispatched today"
                                  : "Made to order — 8–14 weeks"}
                              </p>
                            </div>
                          </div>
                          <p className="shrink-0 text-[14px] tabular-nums">
                            {formatPrice(product.price * line.quantity)}
                          </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-5">
                          <Quantity
                            value={line.quantity}
                            onChange={(v) => setQuantity(line.slug, line.size, v)}
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

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/shop" className="link-line eyebrow text-[9px] opacity-60">
              Continue shopping
            </Link>
            <Link href="/wishlist" className="link-line eyebrow text-[9px] opacity-60">
              View wishlist
            </Link>
          </div>
        </div>

        {/* summary */}
        <div className="lg:col-span-5">
          <div className="bg-ivory-2 p-7 lg:sticky lg:top-[110px] md:p-9">
            <p className="eyebrow">Order summary</p>

            <dl className="mt-7 space-y-3.5 text-[14px]">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {applied && (
                <Row
                  label={`Discount — ${applied.code}`}
                  value={`− ${formatPrice(discount)}`}
                  accent
                />
              )}
              <Row
                label="Insured delivery"
                value={delivery === 0 ? "Complimentary" : formatPrice(delivery)}
              />
            </dl>

            <div className="mt-6 border-t border-ink/12 pt-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">Total</p>
                <p className="display text-[1.75rem] tabular-nums">{formatPrice(total)}</p>
              </div>
              <p className="mt-2 text-[12px] opacity-45">
                Includes {formatPrice(vat)} VAT at 5%
              </p>
            </div>

            {/* delivery threshold */}
            {delivery > 0 && (
              <div className="mt-6">
                <p className="text-[12.5px] opacity-60">
                  {formatPrice(FREE_SHIPPING - afterDiscount)} more for complimentary delivery
                </p>
                <div className="mt-2.5 h-px w-full bg-ink/12">
                  <motion.span
                    className="block h-full origin-left bg-gold"
                    initial={false}
                    animate={{ scaleX: Math.min(1, afterDiscount / FREE_SHIPPING) }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </div>
              </div>
            )}

            {/* promotion */}
            <div className="mt-8">
              <label className="eyebrow text-[9px] opacity-55" htmlFor="promo">
                Promotion code
              </label>
              <div className="mt-2 flex items-end gap-3">
                <input
                  id="promo"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError("");
                  }}
                  placeholder="RITZA10"
                  className="field flex-1"
                />
                <button
                  type="button"
                  onClick={applyCode}
                  className="eyebrow border-b border-ink/25 pb-3 text-[9px] transition-colors hover:border-gold hover:text-gold-3"
                >
                  Apply
                </button>
              </div>
              {codeError && <p className="mt-2 text-[12.5px] text-gold-3">{codeError}</p>}
              {applied && (
                <p className="mt-2 text-[12.5px] text-gold-3">{applied.label} applied</p>
              )}
            </div>

            <ButtonLink href="/checkout" variant="ink" className="mt-8 w-full">
              Proceed to checkout
            </ButtonLink>

            <p className="mt-5 text-[12px] leading-relaxed opacity-45">
              Every order ships fully insured with signature on delivery, in a lacquered box with
              its certification.
            </p>
          </div>
        </div>
      </div>

      {/* suggestions */}
      <Reveal className="mt-24">
        <p className="eyebrow text-gold-3">Often bought alongside</p>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {products
            .filter((p) => !cart.some((l) => l.slug === p.slug))
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
        </div>
      </Reveal>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="opacity-60">{label}</dt>
      <dd className={cn("tabular-nums", accent && "text-gold-3")}>{value}</dd>
    </div>
  );
}
