import Link from "next/link";
import { Reveal, TextReveal } from "@/components/ui/motion";
import { site } from "@/lib/data/site";

export type PolicySection = { title: string; body: string };

const RELATED = [
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Frequently Asked", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

/* Shared shell for the four policy pages: a numbered section list with a
   sticky index beside it on desktop. */
export function PolicyPage({
  eyebrow,
  title,
  lede,
  sections,
  updated = "September 2026",
  current,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  sections: PolicySection[];
  updated?: string;
  current: string;
}) {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">{eyebrow}</span>
          </div>
        </Reveal>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.5rem,1.5rem+4.4vw,5rem)]">
          <TextReveal text={title} />
        </h1>
        <Reveal delay={0.15}>
          <p className="lede mt-8 max-w-xl">{lede}</p>
          <p className="eyebrow mt-6 text-[9px] opacity-40">Last updated {updated}</p>
        </Reveal>
      </div>

      <section className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 md:py-20">
        {/* index */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-[120px]">
            <p className="eyebrow text-gold-3">On this page</p>
            <ol className="mt-5 space-y-2.5">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a
                    href={`#s-${i + 1}`}
                    className="link-line flex gap-3 text-[13px] opacity-60 transition-opacity hover:opacity-100"
                  >
                    <span className="tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>

            <p className="eyebrow mt-10 text-gold-3">Also useful</p>
            <ul className="mt-5 space-y-2.5">
              {RELATED.filter((r) => r.href !== current).map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="link-line text-[13px] opacity-60">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* body */}
        <div className="lg:col-span-8 lg:col-start-5">
          <ol className="border-t border-ink/10">
            {sections.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.04} className="border-b border-ink/10">
                <div id={`s-${i + 1}`} className="scroll-mt-[120px] py-9">
                  <p className="eyebrow text-[9px] text-gold-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
                    {s.title}
                  </h2>
                  <p className="lede mt-4 max-w-2xl">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-14 bg-ivory-2 p-8">
            <p className="eyebrow text-gold-3">Still unclear?</p>
            <p className="lede mt-4 max-w-lg text-[14px]">
              Message us on WhatsApp and a person answers — usually within an hour during opening
              times, always within one working day.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="link-line eyebrow text-[9px]"
              >
                WhatsApp {site.whatsapp}
              </a>
              <a href={`mailto:${site.email}`} className="link-line eyebrow text-[9px]">
                {site.email}
              </a>
              <Link href="/contact" className="link-line eyebrow text-[9px] text-gold-3">
                Contact page
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
