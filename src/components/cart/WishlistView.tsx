"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getProduct, products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { EASE } from "@/components/ui/motion";

export function WishlistView() {
  const { wishlist, toggleWishlist, addToCart, hydrated } = useStore();
  const saved = wishlist.map(getProduct).filter(Boolean) as NonNullable<
    ReturnType<typeof getProduct>
  >[];

  if (!hydrated) return <div className="shell min-h-[50vh] py-20" />;

  if (saved.length === 0) {
    return (
      <div className="shell py-16">
        <div className="border-y border-ink/10 py-24 text-center">
          <p className="display text-[clamp(2rem,1.4rem+2.4vw,3.5rem)]">Nothing saved yet</p>
          <p className="lede mx-auto mt-5 max-w-md">
            Tap the heart on any piece and it will wait for you here, on this device.
          </p>
          <ButtonLink href="/shop" variant="ink" className="mt-9">
            Browse the collection
          </ButtonLink>
        </div>

        <div className="mt-20">
          <p className="eyebrow text-gold-3">A place to start</p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <p className="eyebrow">
          {saved.length} {saved.length === 1 ? "piece" : "pieces"} saved
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() =>
            saved.forEach((p, i) =>
              addToCart({ slug: p.slug, quantity: 1, size: p.sizes?.[2] }, { silent: i < saved.length - 1 }),
            )
          }
        >
          Add everything to bag
        </Button>
      </div>

      <ul className="divide-y divide-ink/10">
        <AnimatePresence initial={false}>
          {saved.map((product) => (
            <motion.li
              key={product.slug}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center">
                <Link
                  href={`/product/${product.slug}`}
                  className="relative aspect-[3/4] w-[120px] shrink-0 overflow-hidden bg-sand"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/product/${product.slug}`} className="link-line text-[16px]">
                    {product.name}
                  </Link>
                  <p className="mt-1.5 text-[12.5px] opacity-50">{product.tagline}</p>
                  <p className="mt-3 text-[14px] tabular-nums">{formatPrice(product.price)}</p>
                  <p className="mt-1 text-[12.5px] opacity-50">
                    {product.inStock ? "In stock" : "Made to order"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Button
                    variant="ink"
                    size="sm"
                    onClick={() =>
                      addToCart({ slug: product.slug, quantity: 1, size: product.sizes?.[2] })
                    }
                  >
                    Add to bag
                  </Button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.slug)}
                    className="link-line eyebrow text-[9px] opacity-45"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
