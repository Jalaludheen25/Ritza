"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/data/products";
import { ProductGrid } from "@/components/collections/ProductGrid";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { cn, formatPrice } from "@/lib/utils";
import { site } from "@/lib/data/site";

/* Mock order history — enough to show the shape of the account area. */
const ORDERS = [
  {
    ref: "RZ-482190",
    date: "2 May 2026",
    status: "Delivered",
    total: 660,
    items: [
      { slug: "vega-sculpted-cuff", qty: 1 },
      { slug: "halo-everyday-hoops", qty: 1 },
    ],
  },
  {
    ref: "RZ-471044",
    date: "14 March 2026",
    status: "In the workshop",
    total: 2800,
    items: [{ slug: "kasu-mala-necklace", qty: 1 }],
  },
  {
    ref: "RZ-460318",
    date: "8 January 2026",
    status: "Delivered",
    total: 820,
    items: [{ slug: "sol-coin-layer-set", qty: 1 }],
  },
];

const ADDRESSES = [
  {
    label: "Home",
    name: "—",
    lines: ["Villa 22, Street 14b", "Jumeirah 1, Dubai", "United Arab Emirates"],
    default: true,
  },
  {
    label: "Office",
    name: "—",
    lines: ["Level 18, Emirates Towers", "Sheikh Zayed Road, Dubai", "United Arab Emirates"],
    default: false,
  },
];

const TABS = ["Orders", "Wishlist", "Details", "Addresses"] as const;
type Tab = (typeof TABS)[number];

export function AccountView() {
  const { customer, signOut, wishlist, hydrated } = useStore();
  const [tab, setTab] = useState<Tab>("Orders");

  const name = customer?.name ?? "Guest";
  const email = customer?.email ?? "guest@ritza.ae";
  const saved = wishlist.map(getProduct).filter(Boolean) as NonNullable<
    ReturnType<typeof getProduct>
  >[];

  return (
    <div className="shell py-10 md:py-14">
      {/* header */}
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-gold-3">Your account</p>
          <h1 className="display mt-5 text-[clamp(2.25rem,1.5rem+3.4vw,4rem)] capitalize">
            {hydrated ? name : " "}
          </h1>
          <p className="mt-2 text-[13.5px] opacity-50">{hydrated ? email : ""}</p>
        </div>
        <div className="flex items-center gap-5">
          {customer ? (
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <ButtonLink href="/login" variant="outline" size="sm">
              Sign in
            </ButtonLink>
          )}
          <ButtonLink href="/contact" variant="ink" size="sm">
            Visit the counter
          </ButtonLink>
        </div>
      </div>

      {!customer && hydrated && (
        <p className="mt-6 bg-ivory-2 p-4 text-[13px] opacity-60">
          You are browsing the account area as a guest. Sign in to attach these details to a
          profile — in this prototype the orders below are illustrative.
        </p>
      )}

      {/* summary */}
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Stat label="Orders placed" value={String(ORDERS.length)} />
        <Stat label="Pieces saved" value={hydrated ? String(saved.length) : "—"} />
        <Stat label="Care visits included" value="Unlimited" />
      </div>

      {/* tabs */}
      <div className="mt-14 flex gap-7 overflow-x-auto border-b border-ink/10">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className="relative shrink-0 pb-3">
            <span
              className={cn(
                "eyebrow transition-colors duration-500",
                tab === t ? "text-ink" : "text-ink/35 hover:text-ink/60",
              )}
            >
              {t}
              {t === "Wishlist" && hydrated && saved.length > 0 ? ` (${saved.length})` : ""}
            </span>
            {tab === t && (
              <motion.span
                layoutId="account-tab"
                className="absolute inset-x-0 -bottom-px h-px bg-gold"
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="pt-10"
        >
          {tab === "Orders" && (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {ORDERS.map((order) => (
                <li key={order.ref} className="py-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-[15px] tabular-nums">{order.ref}</p>
                        <span
                          className={cn(
                            "eyebrow px-2 py-1 text-[8px]",
                            order.status === "Delivered"
                              ? "bg-ink/8 text-ink/60"
                              : "bg-gold text-ink",
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12.5px] opacity-50">Placed {order.date}</p>
                    </div>
                    <p className="text-[14px] tabular-nums">{formatPrice(order.total)}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {order.items.map((item) => {
                      const product = getProduct(item.slug);
                      if (!product) return null;
                      return (
                        <Link
                          key={item.slug}
                          href={`/product/${product.slug}`}
                          className="group flex items-center gap-3"
                        >
                          <span className="relative block aspect-[3/4] w-14 shrink-0 overflow-hidden bg-sand">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </span>
                          <span className="text-[13px]">{product.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex gap-6">
                    <button type="button" className="link-line eyebrow text-[9px] opacity-55">
                      View invoice
                    </button>
                    <button type="button" className="link-line eyebrow text-[9px] opacity-55">
                      Arrange a care visit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === "Wishlist" &&
            (saved.length === 0 ? (
              <div className="border-y border-ink/10 py-20 text-center">
                <p className="display text-3xl">Nothing saved yet</p>
                <ButtonLink href="/shop" variant="outline" className="mt-7">
                  Browse the collection
                </ButtonLink>
              </div>
            ) : (
              <ProductGrid pieces={saved} columns={4} />
            ))}

          {tab === "Details" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow text-gold-3">Personal details</p>
                <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  <Detail label="Name" value={name} />
                  <Detail label="Email" value={email} />
                  <Detail label="Mobile" value="+971 50 ••• ••42" />
                  <Detail label="Bangle size on file" value="2.6&quot;" />
                  <Detail label="Preferred finish" value="18k gold PVD" />
                </dl>
                <Button variant="outline" size="sm" className="mt-7">
                  Edit details
                </Button>
              </div>
              <div>
                <p className="eyebrow text-gold-3">The letter</p>
                <p className="mt-6 text-[13.5px] leading-relaxed opacity-60">
                  You are subscribed to the house letter — six a year, and first refusal on anything
                  made in a run of ten or fewer.
                </p>
                <Button variant="outline" size="sm" className="mt-7">
                  Manage preferences
                </Button>

                <p className="eyebrow mt-12 text-gold-3">Your salon</p>
                <p className="mt-6 text-[13.5px] leading-relaxed opacity-60">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.phone}
                </p>
              </div>
            </div>
          )}

          {tab === "Addresses" && (
            <div className="grid gap-6 sm:grid-cols-2">
              {ADDRESSES.map((a) => (
                <div key={a.label} className="border border-ink/12 p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">{a.label}</p>
                    {a.default && <span className="eyebrow text-[9px] text-gold-3">Default</span>}
                  </div>
                  <p className="mt-5 text-[13.5px] leading-relaxed opacity-65">
                    {a.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </p>
                  <div className="mt-6 flex gap-5">
                    <button type="button" className="link-line eyebrow text-[9px] opacity-55">
                      Edit
                    </button>
                    <button type="button" className="link-line eyebrow text-[9px] opacity-55">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="flex min-h-[180px] items-center justify-center border border-dashed border-ink/20 transition-colors hover:border-ink/45"
              >
                <span className="eyebrow text-[9px] opacity-55">+ Add an address</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory-2 p-6">
      <p className="eyebrow text-[9px] opacity-45">{label}</p>
      <p className="display mt-3 text-3xl">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3.5">
      <dt className="text-[13.5px] opacity-50">{label}</dt>
      <dd className="text-[13.5px] capitalize">{value}</dd>
    </div>
  );
}
