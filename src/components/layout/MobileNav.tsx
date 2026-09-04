"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Lockup } from "@/components/ui/Logo";
import { EASE } from "@/components/ui/motion";
import { useStore } from "@/lib/store";
import { collections, categories } from "@/lib/data/collections";
import { site } from "@/lib/data/site";
import { lockScroll } from "./SmoothScroll";

const PRIMARY = [
  { label: "Shop all", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const { navOpen, setNavOpen, wishlist } = useStore();

  useEffect(() => {
    lockScroll(navOpen);
    return () => lockScroll(false);
  }, [navOpen]);

  return (
    <AnimatePresence>
      {navOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col bg-ivory lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="shell flex h-[62px] shrink-0 items-center justify-between">
            <Lockup tone="ink" className="w-[74px]" />
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute top-1/2 left-0 h-px w-4 rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-0 h-px w-4 -rotate-45 bg-ink" />
              </span>
            </button>
          </div>

          <div className="hide-scrollbar flex-1 overflow-y-auto overscroll-contain">
            <nav className="shell pt-6 pb-10">
              <ul>
                {PRIMARY.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease: EASE }}
                    className="border-b border-ink/10"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      className="display flex items-center justify-between py-5 text-[2.4rem]"
                    >
                      {item.label}
                      <span className="text-xs opacity-30">↗</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.8 }}
              >
                <p className="eyebrow mt-10 mb-4 text-gold-3">Categories</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      onClick={() => setNavOpen(false)}
                      className="group relative aspect-[4/3] overflow-hidden bg-sand"
                    >
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="45vw"
                        className="object-cover transition-transform duration-700 group-active:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
                      <span className="eyebrow absolute bottom-3 left-3 text-ivory">{c.name}</span>
                    </Link>
                  ))}
                </div>

                <p className="eyebrow mt-10 mb-4 text-gold-3">Collections</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {collections.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        onClick={() => setNavOpen(false)}
                        className="text-[15px] opacity-70"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-center gap-6 border-t border-ink/10 pt-6">
                  <Link
                    href="/account"
                    onClick={() => setNavOpen(false)}
                    className="eyebrow link-line"
                  >
                    Account
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setNavOpen(false)}
                    className="eyebrow link-line"
                  >
                    Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ""}
                  </Link>
                </div>

                <div className="mt-8 space-y-1 text-[13px] opacity-55">
                  <p>{site.address.line1}</p>
                  <p>{site.address.line2}</p>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="block pt-2">
                    {site.phone}
                  </a>
                </div>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
