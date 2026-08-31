"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wordmark, Monogram } from "@/components/ui/Logo";
import { Reveal, EASE } from "@/components/ui/motion";
import { collections, categories } from "@/lib/data/collections";
import { site } from "@/lib/data/site";
import { ArrowRight } from "@/components/ui/Button";

const CARE = [
  { label: "Shipping & returns", href: "/contact#shipping" },
  { label: "Sizing guide", href: "/contact#sizing" },
  { label: "Care & repairs", href: "/contact#care" },
  { label: "Book an appointment", href: "/contact" },
  { label: "Frequently asked", href: "/contact#faq" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* mark + newsletter */}
          <div className="lg:col-span-5">
            <Reveal>
              <Wordmark tone="ivory" className="w-[132px]" />
              <p className="lede mt-8 max-w-sm text-ivory/55">
                A Dubai house working in 18k gold, certified stones and Gulf pearls. Everything we
                sell is finished by hand, ten minutes from where you are standing.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow text-gold-2">The letter</p>
              <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-ivory/50">
                New pieces, atelier notes and private viewings. Six times a year, never more.
              </p>
              <form
                className="mt-6 max-w-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email) return;
                  setSent(true);
                  setEmail("");
                }}
              >
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    aria-label="Email address"
                    className="field field-dark pr-12"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-0 grid h-10 w-10 place-items-center text-gold-2 transition-transform duration-500 hover:translate-x-1"
                  >
                    <ArrowRight />
                  </button>
                </div>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="eyebrow mt-3 text-[9px] text-gold-2"
                  >
                    Thank you — please confirm from your inbox
                  </motion.p>
                )}
              </form>
            </Reveal>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn
              title="Shop"
              links={[
                ...categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
                { label: "Everything", href: "/shop" },
              ]}
            />
            <FooterColumn
              title="Collections"
              links={collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` }))}
            />
            <FooterColumn title="Client care" links={CARE} />
          </div>
        </div>

        {/* atelier strip */}
        <div className="mt-20 grid gap-8 border-t border-ivory/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow text-ivory/40">Salon</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ivory/70">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.country}
            </p>
          </div>
          <div>
            <p className="eyebrow text-ivory/40">Hours</p>
            <div className="mt-3 space-y-1 text-[13.5px] text-ivory/70">
              {site.hours.map((h) => (
                <p key={h.days}>
                  {h.days} — {h.time}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow text-ivory/40">Contact</p>
            <div className="mt-3 space-y-1 text-[13.5px] text-ivory/70">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="block link-line">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block link-line">
                {site.email}
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow text-ivory/40">Follow</p>
            <div className="mt-3 space-y-1 text-[13.5px] text-ivory/70">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block link-line"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* oversized mark */}
      <div className="pointer-events-none relative -mt-6 flex max-h-[220px] justify-center overflow-hidden md:max-h-[300px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 0.07, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="w-[130%] max-w-[1400px] translate-y-[22%] md:w-full"
        >
          <Wordmark tone="ivory" className="w-full" />
        </motion.div>
      </div>

      <div className="shell relative flex flex-col items-center gap-4 border-t border-ivory/10 py-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Monogram tone="ivory" className="w-5 opacity-60" />
          <p className="text-[11px] tracking-wide text-ivory/40">
            © {new Date().getFullYear()} {site.legalName}
          </p>
        </div>
        <div className="flex items-center gap-6 text-[11px] text-ivory/40">
          <Link href="/contact" className="link-line">
            Privacy
          </Link>
          <Link href="/contact" className="link-line">
            Terms
          </Link>
          <span className="hidden sm:inline">Prices in UAE dirhams</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="eyebrow text-ivory/40">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="link-line text-[13.5px] text-ivory/70">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
