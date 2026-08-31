"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Wordmark } from "@/components/ui/Logo";
import { EASE } from "@/components/ui/motion";
import { useHeaderTone, useStore } from "@/lib/store";
import { collections, categories } from "@/lib/data/collections";
import { products } from "@/lib/data/products";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";

const NAV = [
  { label: "Shop", href: "/shop", menu: "shop" as const },
  { label: "Collections", href: "/collections", menu: "collections" as const },
  { label: "About", href: "/about", menu: null },
  { label: "Contact", href: "/contact", menu: null },
];

export function Header() {
  const pathname = usePathname();
  const { tone } = useHeaderTone();
  const { count, wishlist, setCartOpen, setSearchOpen, setNavOpen, navOpen } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<"shop" | "collections" | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > prev && !menu && !navOpen);
  });

  useEffect(() => setMenu(null), [pathname]);

  /* tone "light" = the page opens on a dark hero, so the bar starts
     transparent with ivory type and only fills in once you scroll. */
  const overMedia = tone === "light";
  const solid = scrolled || menu !== null || !overMedia;
  const ink = solid ? "text-ink" : "text-ivory";

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      onMouseLeave={() => setMenu(null)}
      data-solid={solid}
    >
      <motion.div
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* announcement */}
        <AnimatePresence initial={false}>
          {!scrolled && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 34 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden bg-ink text-ivory"
            >
              <div className="shell flex h-[34px] items-center justify-center gap-6">
                <p className="eyebrow text-[9px] text-ivory/75">
                  Complimentary insured delivery across the GCC
                </p>
                <span className="hidden h-3 w-px bg-ivory/20 sm:block" />
                <p className="eyebrow hidden text-[9px] text-ivory/75 sm:block">
                  Atelier appointments — Alserkal Avenue
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bar */}
        <div
          className={cn(
            "relative transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            solid ? "bg-ivory" : "bg-transparent",
          )}
        >
          <div className="shell flex h-[62px] items-center justify-between md:h-[76px]">
            {/* left — desktop nav */}
            <nav className="hidden flex-1 items-center gap-8 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setMenu(item.menu)}
                  data-active={pathname.startsWith(item.href)}
                  className={cn("link-line eyebrow transition-colors duration-500", ink)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* left — mobile burger */}
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className={cn("flex flex-1 items-center lg:hidden", ink)}
            >
              <span className="relative block h-3 w-6">
                <span className="absolute inset-x-0 top-0 h-px bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-px w-4 bg-current" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
              </span>
            </button>

            {/* centre — the mark */}
            <Link
              href="/"
              aria-label="Ritza — home"
              className="absolute left-1/2 -translate-x-1/2"
            >
              <Wordmark
                tone={solid ? "ink" : "ivory"}
                priority
                className="w-[92px] transition-opacity duration-500 md:w-[112px]"
              />
            </Link>

            {/* right — utilities */}
            <div className={cn("flex flex-1 items-center justify-end gap-5 md:gap-7", ink)}>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="hidden transition-opacity hover:opacity-60 sm:block"
              >
                <Search />
              </button>
              <Link
                href="/account"
                aria-label="Account"
                className="hidden transition-opacity hover:opacity-60 sm:block"
              >
                <User />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden transition-opacity hover:opacity-60 sm:block"
              >
                <Heart />
                {wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Shopping bag"
                className="relative transition-opacity hover:opacity-60"
              >
                <Bag />
                {count > 0 && <Dot>{count}</Dot>}
              </button>
            </div>
          </div>

          <span
            className={cn(
              "absolute inset-x-0 bottom-0 h-px origin-left bg-ink/10 transition-transform duration-500",
              solid ? "scale-x-100" : "scale-x-0",
            )}
          />
        </div>
      </motion.div>

      <MegaMenu open={menu} onClose={() => setMenu(null)} />
    </header>
  );
}

/* ------------------------------------------------------------ mega menu */

function MegaMenu({
  open,
  onClose,
}: {
  open: "shop" | "collections" | null;
  onClose: () => void;
}) {
  const featured = products.find((p) => p.slug === "noor-riviere-necklace")!;
  const secondary = products.find((p) => p.slug === "dune-hoop-earrings")!;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={open}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="hidden overflow-hidden border-t border-ink/8 bg-ivory lg:block"
        >
          <div className="shell grid grid-cols-12 gap-10 py-12">
            {open === "shop" ? (
              <>
                <div className="col-span-3">
                  <p className="eyebrow mb-6 text-gold-3">By category</p>
                  <ul className="space-y-3.5">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/shop?category=${c.slug}`}
                          onClick={onClose}
                          className="display link-line text-2xl transition-opacity hover:opacity-60"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-3">
                  <p className="eyebrow mb-6 text-gold-3">Edits</p>
                  <ul className="space-y-3">
                    {[
                      { label: "New arrivals", href: "/shop?sort=newest" },
                      { label: "Best sellers", href: "/shop?edit=bestsellers" },
                      { label: "Limited editions", href: "/shop?edit=limited" },
                      { label: "Under AED 6,000", href: "/shop?max=6000" },
                      { label: "Bridal", href: "/collections/vow" },
                      { label: "Everything", href: "/shop" },
                    ].map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={onClose}
                          className="link-line text-[13.5px] opacity-70 transition-opacity hover:opacity-100"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <MenuFeature product={featured} label="The house signature" onClose={onClose} />
                <MenuFeature product={secondary} label="Most worn" onClose={onClose} />
              </>
            ) : (
              <>
                <div className="col-span-5">
                  <p className="eyebrow mb-6 text-gold-3">Five collections</p>
                  <ul className="space-y-4">
                    {collections.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/collections/${c.slug}`}
                          onClick={onClose}
                          className="group flex items-baseline gap-4"
                        >
                          <span className="display text-3xl transition-opacity group-hover:opacity-60">
                            {c.name}
                          </span>
                          <span className="text-[12px] opacity-45">{c.meaning}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {collections.slice(0, 3).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={onClose}
                    className="group col-span-2 block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                      <Image
                        src={c.cover}
                        alt={c.name}
                        fill
                        sizes="220px"
                        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                    <p className="eyebrow mt-3">{c.name}</p>
                  </Link>
                ))}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuFeature({
  product,
  label,
  onClose,
}: {
  product: (typeof products)[number];
  label: string;
  onClose: () => void;
}) {
  return (
    <Link href={`/product/${product.slug}`} onClick={onClose} className="group col-span-3 block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <p className="eyebrow mt-4 text-gold-3">{label}</p>
      <p className="mt-2 text-[15px]">{product.name}</p>
      <p className="mt-1 text-[13px] opacity-55">{formatPrice(product.price)}</p>
    </Link>
  );
}

/* ---------------------------------------------------------------- icons */

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1.5 -right-2 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-gold px-1 text-[9px] leading-none font-medium text-ink tabular-nums">
      {children}
    </span>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Search() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <circle cx="8" cy="8" r="6.2" {...stroke} />
      <path d="M12.6 12.6 17 17" {...stroke} />
    </svg>
  );
}

function User() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <circle cx="9" cy="6" r="3.4" {...stroke} />
      <path d="M2.6 16.4c.7-3.4 3.3-5.2 6.4-5.2s5.7 1.8 6.4 5.2" {...stroke} />
    </svg>
  );
}

function Heart() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M9 15.4S2.2 11.3 2.2 6.9A3.7 3.7 0 0 1 9 4.9a3.7 3.7 0 0 1 6.8 2c0 4.4-6.8 8.5-6.8 8.5Z"
        {...stroke}
      />
    </svg>
  );
}

function Bag() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden>
      <path d="M3.4 5.6h11.2l-.9 10.8H4.3L3.4 5.6Z" {...stroke} />
      <path d="M6.4 7.4V4.9a2.6 2.6 0 0 1 5.2 0v2.5" {...stroke} />
    </svg>
  );
}
