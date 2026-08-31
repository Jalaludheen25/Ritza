"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { products, priceBounds } from "@/lib/data/products";
import { collections, categories } from "@/lib/data/collections";
import { ProductCard } from "./ProductCard";
import { QuickView } from "./QuickView";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { cn, formatPrice, titleCase } from "@/lib/utils";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "rating", label: "Best rated" },
];

const METALS = ["yellow-gold", "white-gold", "rose-gold", "platinum"] as const;
const STONES = ["Diamond", "Pearl", "Emerald", "None"];

export type ShopFilters = {
  category: string;
  collections: string[];
  metals: string[];
  stones: string[];
  max: number;
  sort: Sort;
  edit: string;
  q: string;
};

export function ShopView({ initial }: { initial: Partial<ShopFilters> }) {
  const router = useRouter();
  const [quick, setQuick] = useState<Product | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const [f, setF] = useState<ShopFilters>({
    category: initial.category ?? "all",
    collections: initial.collections ?? [],
    metals: initial.metals ?? [],
    stones: initial.stones ?? [],
    max: initial.max ?? priceBounds.max,
    sort: (initial.sort as Sort) ?? "featured",
    edit: initial.edit ?? "",
    q: initial.q ?? "",
  });

  const set = useCallback(<K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => {
    setF((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggle = useCallback((key: "collections" | "metals" | "stones", value: string) => {
    setF((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }, []);

  /* Keep the address bar in step so a filtered view can be shared. */
  useEffect(() => {
    const p = new URLSearchParams();
    if (f.category !== "all") p.set("category", f.category);
    if (f.collections.length) p.set("collection", f.collections.join(","));
    if (f.metals.length) p.set("metal", f.metals.join(","));
    if (f.stones.length) p.set("stone", f.stones.join(","));
    if (f.max < priceBounds.max) p.set("max", String(f.max));
    if (f.sort !== "featured") p.set("sort", f.sort);
    if (f.edit) p.set("edit", f.edit);
    if (f.q) p.set("q", f.q);
    const qs = p.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }, [f, router]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (f.category !== "all" && p.category !== f.category) return false;
      if (f.collections.length && !f.collections.includes(p.collection)) return false;
      if (f.metals.length && !f.metals.includes(p.metal)) return false;
      if (f.stones.length && !f.stones.includes(p.stone)) return false;
      if (p.price > f.max) return false;
      if (f.edit === "bestsellers" && !p.badges.includes("bestseller")) return false;
      if (f.edit === "limited" && !p.badges.includes("limited")) return false;
      if (q) {
        const hay = [p.name, p.tagline, p.description, p.collection, p.category, p.stone]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (f.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case "newest":
        list = [...list].sort(
          (a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new")),
        );
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(b.badges.length > 0) - Number(a.badges.length > 0),
        );
    }
    return list;
  }, [f]);

  const activeCount =
    f.collections.length +
    f.metals.length +
    f.stones.length +
    (f.max < priceBounds.max ? 1 : 0) +
    (f.edit ? 1 : 0);

  const clearAll = () =>
    setF({
      category: "all",
      collections: [],
      metals: [],
      stones: [],
      max: priceBounds.max,
      sort: "featured",
      edit: "",
      q: "",
    });

  return (
    <>
      {/* category strip */}
      <div className="shell">
        <div className="hide-scrollbar -mx-5 flex gap-7 overflow-x-auto px-5 md:mx-0 md:px-0">
          {[{ slug: "all", name: "All pieces" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => set("category", c.slug)}
              className={cn(
                "display relative shrink-0 pb-3 text-[1.6rem] transition-colors duration-500 md:text-[2rem]",
                f.category === c.slug ? "text-ink" : "text-ink/30 hover:text-ink/60",
              )}
            >
              {c.name}
              {f.category === c.slug && (
                <motion.span
                  layoutId="cat-underline"
                  className="absolute inset-x-0 bottom-0 h-px bg-gold"
                  transition={{ duration: 0.5, ease: EASE }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* toolbar */}
      <div className="sticky top-[62px] z-40 mt-6 border-y border-ink/10 bg-ivory/92 backdrop-blur-md md:top-[76px]">
        <div className="shell flex items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
              className="eyebrow flex items-center gap-2.5 transition-opacity hover:opacity-60"
            >
              <span className="relative block h-2.5 w-3.5">
                <span className="absolute inset-x-0 top-0 h-px bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-px w-2.5 bg-current" />
                <span className="absolute inset-x-0 bottom-0 h-px w-1.5 bg-current" />
              </span>
              Filters
              {activeCount > 0 && <span className="text-gold-3">({activeCount})</span>}
            </button>
            <span className="hidden text-[12px] opacity-45 sm:block">
              {results.length} {results.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <label className="relative hidden items-center md:flex">
              <span className="sr-only">Search pieces</span>
              <input
                value={f.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Search"
                className="w-40 border-b border-ink/15 bg-transparent pb-1 text-[13px] outline-none transition-[width,border-color] duration-500 placeholder:text-ink/35 focus:w-56 focus:border-gold"
              />
            </label>

            <label className="flex items-center gap-2">
              <span className="eyebrow hidden text-ink/40 sm:block">Sort</span>
              <select
                value={f.sort}
                onChange={(e) => set("sort", e.target.value as Sort)}
                className="eyebrow cursor-pointer appearance-none bg-transparent pr-4 outline-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='6'%3E%3Cpath d='M1 1l3.5 3.5L8 1' stroke='%230b1b38' fill='none'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                }}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* filter panel */}
        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden border-t border-ink/10 bg-ivory"
            >
              <div className="shell grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
                <FilterGroup title="Collection">
                  {collections.map((c) => (
                    <Check
                      key={c.slug}
                      label={c.name}
                      checked={f.collections.includes(c.slug)}
                      onChange={() => toggle("collections", c.slug)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Metal">
                  {METALS.map((m) => (
                    <Check
                      key={m}
                      label={titleCase(m)}
                      checked={f.metals.includes(m)}
                      onChange={() => toggle("metals", m)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Stone">
                  {STONES.map((s) => (
                    <Check
                      key={s}
                      label={s === "None" ? "No stone" : s}
                      checked={f.stones.includes(s)}
                      onChange={() => toggle("stones", s)}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Maximum price">
                  <p className="display text-2xl tabular-nums">{formatPrice(f.max)}</p>
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={100}
                    value={f.max}
                    onChange={(e) => set("max", Number(e.target.value))}
                    aria-label="Maximum price"
                    className="mt-4 w-full accent-[var(--color-gold)]"
                  />
                  <div className="mt-2 flex justify-between text-[11px] opacity-40">
                    <span>{formatPrice(priceBounds.min)}</span>
                    <span>{formatPrice(priceBounds.max)}</span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      { label: "Best sellers", value: "bestsellers" },
                      { label: "Limited", value: "limited" },
                    ].map((e) => (
                      <button
                        key={e.value}
                        type="button"
                        onClick={() => set("edit", f.edit === e.value ? "" : e.value)}
                        className={cn(
                          "eyebrow border px-3 py-2 text-[9px] transition-colors duration-300",
                          f.edit === e.value
                            ? "border-ink bg-ink text-ivory"
                            : "border-ink/18 hover:border-ink/45",
                        )}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </FilterGroup>
              </div>

              <div className="shell flex items-center justify-between border-t border-ink/10 py-4">
                <button
                  type="button"
                  onClick={clearAll}
                  className="eyebrow link-line text-[9px] opacity-55"
                >
                  Clear everything
                </button>
                <Button variant="ink" size="sm" onClick={() => setPanelOpen(false)}>
                  Show {results.length} {results.length === 1 ? "piece" : "pieces"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* grid */}
      <div className="shell py-12 md:py-16">
        <h2 className="sr-only">Pieces</h2>
        {results.length === 0 ? (
          <div className="py-24 text-center">
            <p className="display text-3xl">Nothing matches those filters</p>
            <p className="lede mx-auto mt-4 max-w-sm">
              Try widening the price, or clearing a facet or two.
            </p>
            <Button variant="outline" className="mt-8" onClick={clearAll}>
              Clear everything
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {results.map((product, i) => (
                <motion.div
                  key={product.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, delay: Math.min(i, 7) * 0.04, ease: EASE }}
                >
                  <ProductCard
                    product={product}
                    reveal={false}
                    onQuickView={setQuick}
                    priority={i < 4}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4 text-gold-3">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[13.5px]">
      <span
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center border transition-colors duration-300",
          checked ? "border-ink bg-ink" : "border-ink/25",
        )}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" aria-hidden>
            <path d="M1 3.6 3.3 6 8 1" stroke="var(--color-ivory)" strokeWidth="1.3" fill="none" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={cn("transition-opacity", checked ? "opacity-100" : "opacity-65")}>
        {label}
      </span>
    </label>
  );
}
