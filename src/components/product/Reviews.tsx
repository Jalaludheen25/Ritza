"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { reviewsFor, ratingBreakdown } from "@/lib/data/reviews";
import { Stars } from "@/components/ui/bits";
import { Button } from "@/components/ui/Button";
import { Reveal, EASE } from "@/components/ui/motion";
import type { Product } from "@/lib/types";

export function Reviews({ product }: { product: Product }) {
  const list = reviewsFor(product.slug);
  const { total, counts } = ratingBreakdown(product.slug);
  const [shown, setShown] = useState(3);

  return (
    <section id="reviews" className="border-t border-ink/10 py-16 md:py-24">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* summary */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow text-gold-3">What people say</p>
              <div className="mt-6 flex items-end gap-4">
                <p className="display text-[4rem] leading-none">{product.rating.toFixed(1)}</p>
                <div className="pb-2">
                  <Stars rating={product.rating} size={14} className="text-gold-3" />
                  <p className="mt-2 text-[12.5px] opacity-50">
                    {product.reviewCount} reviews, {total} written
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-2.5">
                {counts.map((c) => (
                  <div key={c.star} className="flex items-center gap-3">
                    <span className="w-3 text-[12px] opacity-50 tabular-nums">{c.star}</span>
                    <span className="h-[3px] flex-1 bg-ink/10">
                      <motion.span
                        className="block h-full origin-left bg-gold"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: total ? c.count / total : 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE }}
                      />
                    </span>
                    <span className="w-4 text-right text-[12px] opacity-40 tabular-nums">
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[13px] leading-relaxed opacity-55">
                Reviews are collected after delivery and are only published from verified orders.
              </p>
            </Reveal>
          </div>

          {/* list */}
          <div className="lg:col-span-8">
            {list.length === 0 ? (
              <p className="lede">
                No written reviews for this piece yet — it is one of our newest.
              </p>
            ) : (
              <>
                <ul className="divide-y divide-ink/10 border-t border-ink/10">
                  {list.slice(0, shown).map((r, i) => (
                    <Reveal as="li" key={r.id} delay={i * 0.05} className="py-8">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <Stars rating={r.rating} className="text-gold-3" />
                          {r.verified && (
                            <span className="eyebrow text-[9px] text-gold-3">Verified order</span>
                          )}
                        </div>
                        <span className="text-[12px] opacity-40">{r.date}</span>
                      </div>
                      <h3 className="display mt-4 text-2xl">{r.title}</h3>
                      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed opacity-65">
                        {r.body}
                      </p>
                      <p className="eyebrow mt-4 text-[9px] opacity-45">
                        {r.name} — {r.location}
                      </p>
                    </Reveal>
                  ))}
                </ul>

                {shown < list.length && (
                  <Button
                    variant="outline"
                    className="mt-10"
                    onClick={() => setShown((s) => s + 3)}
                  >
                    Read more reviews
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
