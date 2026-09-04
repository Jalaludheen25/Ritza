import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, TextReveal } from "@/components/ui/motion";
import { Accordion } from "@/components/ui/bits";
import { ButtonLink } from "@/components/ui/Button";
import { faqs, services, site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Frequently Asked",
  description:
    "Anti-tarnish explained, Kerala plating explained, sizing, delivery, returns and how the Virtual Try-On works.",
};

const BANGLE_SIZES = [
  ["2.4\"", "61mm", "Small — slim wrist"],
  ["2.6\"", "66mm", "Medium — the size most ordered"],
  ["2.8\"", "71mm", "Large — or if you prefer a loose fit"],
];

const CHAIN_LENGTHS = [
  ["38–40cm", "Choker", "Sits on the throat — attiyal length"],
  ["42–45cm", "Princess", "Just below the collarbone — our default"],
  ["50–55cm", "Matinee", "Mid-chest, good over a kurta"],
  ["68–76cm", "Haaram", "Waist length, worn for ceremony"],
];

export default function FaqPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">Help</span>
          </div>
        </Reveal>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.5rem,1.5rem+4.4vw,5.5rem)]">
          <TextReveal text="Answered before" />
          <br />
          <em className="font-normal italic">
            <TextReveal text="you ask" delay={0.1} />
          </em>
        </h1>
        <Reveal delay={0.15}>
          <p className="lede mt-8 max-w-lg">
            The questions we get every week — what anti-tarnish actually means, what the traditional
            line is made of, and how to pick a size without a tape measure.
          </p>
        </Reveal>
      </div>

      {/* questions */}
      <section className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 md:py-20">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow text-gold-3">Questions</p>
            <h2 className="display mt-6 text-[clamp(1.9rem,1.3rem+2.6vw,3rem)]">
              Eight things worth knowing
            </h2>
            <p className="lede mt-6">
              If yours is not here,{" "}
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="link-line"
              >
                message us on WhatsApp
              </a>{" "}
              — a person answers.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={0.1}>
            <Accordion defaultOpen={0} items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
          </Reveal>
        </div>
      </section>

      {/* sizing */}
      <section className="bg-ivory-2 py-16 md:py-20" id="sizing">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow text-gold-3">Sizing</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,1.3rem+2.6vw,3rem)]">
                How to pick without guessing
              </h2>
              <p className="lede mt-6">
                For bangles, measure the widest part of your hand with your thumb tucked in, then
                take the size just above that number. Between two? Take the larger — a hinge helps,
                a tight kada does not.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.1}>
              <p className="eyebrow text-ink/45">Bangles and kada</p>
              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {BANGLE_SIZES.map(([size, mm, note]) => (
                  <div key={size} className="flex items-baseline gap-5 py-4">
                    <dt className="display w-16 shrink-0 text-2xl">{size}</dt>
                    <dd className="flex flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="text-[13.5px] opacity-70">{note}</span>
                      <span className="text-[13px] tabular-nums opacity-45">{mm} inner</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.16} className="mt-12">
              <p className="eyebrow text-ink/45">Chain and necklace lengths</p>
              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {CHAIN_LENGTHS.map(([len, name, note]) => (
                  <div key={len} className="flex items-baseline gap-5 py-4">
                    <dt className="w-24 shrink-0 text-[13.5px] tabular-nums">{len}</dt>
                    <dd className="flex flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <span className="text-[14px]">{name}</span>
                      <span className="text-[13px] opacity-50">{note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* care */}
      <section className="py-16 md:py-24" id="care">
        <div className="shell">
          <Reveal>
            <h2 className="eyebrow text-gold-3">What is included</h2>
          </Reveal>
          <div className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07} className="lg:border-l lg:border-ink/10 lg:pl-8">
                <p className="eyebrow text-gold-3">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-4 text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[13px] leading-relaxed opacity-55">{s.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-16 flex flex-wrap items-center gap-4">
            <ButtonLink href="/shipping-returns" variant="ink">
              Shipping &amp; returns in full
            </ButtonLink>
            <Link href="/contact" className="link-line eyebrow text-[9px] opacity-60">
              Or write to us
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
