"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { products } from "@/lib/data/products";
import { collections } from "@/lib/data/collections";
import { formatPrice } from "@/lib/utils";
import { EASE } from "@/components/ui/motion";
import { lockScroll } from "./SmoothScroll";

const SUGGESTED = ["Diamond", "Pearl", "Hoops", "Solitaire", "Gold chain", "Bridal"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lockScroll(searchOpen);
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 420);
    else setQuery("");
    return () => lockScroll(false);
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.tagline, p.category, p.collection, p.stone, p.metal, p.description]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[108] bg-ivory"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="shell flex h-[62px] items-center justify-end md:h-[76px]">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="eyebrow flex items-center gap-3 transition-opacity hover:opacity-55"
            >
              Close
              <span className="relative block h-3.5 w-3.5">
                <span className="absolute top-1/2 left-0 h-px w-3.5 rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-0 h-px w-3.5 -rotate-45 bg-ink" />
              </span>
            </button>
          </div>

          <div className="shell">
            <div className="border-b border-ink/15 pb-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the collection"
                aria-label="Search the collection"
                className="display w-full bg-transparent text-[clamp(1.75rem,1rem+3.6vw,3.75rem)] outline-none placeholder:text-ink/22"
              />
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="eyebrow text-gold-3">Suggested</p>
                <ul className="mt-5 space-y-2.5">
                  {SUGGESTED.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => setQuery(s)}
                        className="link-line text-[14px] opacity-70"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mt-10 text-gold-3">Collections</p>
                <ul className="mt-5 space-y-2.5">
                  {collections.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="link-line text-[14px] opacity-70"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-9">
                {query.trim() === "" ? (
                  <>
                    <p className="eyebrow text-gold-3">Most searched</p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {products.slice(0, 4).map((p) => (
                        <ResultCard key={p.slug} product={p} onNavigate={() => setSearchOpen(false)} />
                      ))}
                    </div>
                  </>
                ) : results.length === 0 ? (
                  <div className="py-6">
                    <p className="display text-2xl">No pieces match “{query}”</p>
                    <p className="lede mt-3 text-[14px]">
                      Try a material, a stone, or the name of a collection.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="eyebrow text-gold-3">
                      {results.length} {results.length === 1 ? "piece" : "pieces"}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {results.map((p, i) => (
                        <motion.div
                          key={p.slug}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.045, ease: EASE }}
                        >
                          <ResultCard product={p} onNavigate={() => setSearchOpen(false)} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultCard({
  product,
  onNavigate,
}: {
  product: (typeof products)[number];
  onNavigate: () => void;
}) {
  return (
    <Link href={`/product/${product.slug}`} onClick={onNavigate} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, 22vw"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-[13.5px]">{product.name}</p>
      <p className="mt-0.5 text-[12.5px] opacity-50">{formatPrice(product.price)}</p>
    </Link>
  );
}
