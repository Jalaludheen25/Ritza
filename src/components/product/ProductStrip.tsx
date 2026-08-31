"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickView } from "@/components/shop/QuickView";
import { SectionHeading } from "@/components/ui/bits";
import { Button, TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/motion";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

/* Two related-product blocks used across product pages: a styled set that
   can be bought in one action, and a plain "more from this collection". */

export function CompleteYourLook({ pieces, hero }: { pieces: Product[]; hero: Product }) {
  const { addToCart } = useStore();
  const total = pieces.reduce((s, p) => s + p.price, hero.price);

  return (
    <section className="border-t border-ink/10 bg-ivory-2 py-16 md:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Complete your look"
          title={
            <>
              Worn <em className="font-normal italic">with</em>
            </>
          }
          action={
            <div className="flex items-center gap-5">
              <span className="hidden text-[13px] opacity-55 sm:block">
                The four together — {formatPrice(total)}
              </span>
              <Button
                variant="ink"
                size="sm"
                onClick={() =>
                  [hero, ...pieces].forEach((p, i) =>
                    addToCart(
                      { slug: p.slug, quantity: 1, size: p.sizes?.[2] },
                      { silent: i < pieces.length },
                    ),
                  )
                }
              >
                Add the set
              </Button>
            </div>
          }
        />

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          <Reveal className="col-span-2 lg:col-span-1">
            <div className="relative h-full min-h-[220px] bg-ink p-6 text-ivory">
              <p className="eyebrow text-gold-2">Styled by the atelier</p>
              <p className="display mt-4 text-[1.75rem] leading-tight">
                The pieces we would put with it
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-ivory/55">
                Chosen for scale and finish rather than for the sake of a set — each of these sits
                well beside the {hero.name.toLowerCase()}.
              </p>
              <Link
                href="/shop"
                className="link-line eyebrow absolute bottom-6 left-6 text-[9px] text-gold-2"
              >
                Browse everything
              </Link>
            </div>
          </Reveal>

          {pieces.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} sizes="(max-width: 1024px) 50vw, 24vw" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedProducts({
  pieces,
  collectionName,
  collectionSlug,
}: {
  pieces: Product[];
  collectionName: string;
  collectionSlug: string;
}) {
  const [quick, setQuick] = useState<Product | null>(null);
  if (pieces.length === 0) return null;

  return (
    <section className="border-t border-ink/10 py-16 md:py-24">
      <div className="shell">
        <SectionHeading
          eyebrow={`More from ${collectionName}`}
          title="You may also like"
          action={<TextLink href={`/collections/${collectionSlug}`}>The collection</TextLink>}
        />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {pieces.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              index={i}
              onQuickView={setQuick}
              sizes="(max-width: 1024px) 50vw, 24vw"
            />
          ))}
        </div>
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}

/** Small horizontal strip of the pieces this browser has already opened. */
export function RecentlyViewed({ exclude }: { exclude: string }) {
  const { recent } = useStore();
  const slugs = recent.filter((s) => s !== exclude).slice(0, 5);
  if (slugs.length === 0) return null;

  return (
    <section className="border-t border-ink/10 py-14">
      <div className="shell">
        <p className="eyebrow text-ink/40">Recently viewed</p>
        <div className="hide-scrollbar mt-7 flex gap-5 overflow-x-auto">
          {slugs.map((slug) => (
            <RecentCard key={slug} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentCard({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) return null;
  return (
    <Link href={`/product/${product.slug}`} className="group w-[150px] shrink-0">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="150px"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <p className="mt-3 truncate text-[13px]">{product.name}</p>
      <p className="mt-0.5 text-[12px] opacity-50">{formatPrice(product.price)}</p>
    </Link>
  );
}
