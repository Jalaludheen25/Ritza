import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal, TextReveal } from "@/components/ui/motion";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Accordion } from "@/components/ui/bits";
import { faqs, services, site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book an appointment at the Alserkal Avenue salon, or write to the atelier. We answer within one working day.",
};

export default function ContactPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      {/* heading */}
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">Contact</span>
          </div>
        </Reveal>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.5rem,1.5rem+4.4vw,5.5rem)]">
          <TextReveal text="Talk to the people" />
          <br />
          <em className="font-normal italic">
            <TextReveal text="who make it" delay={0.1} />
          </em>
        </h1>
        <Reveal delay={0.15}>
          <p className="lede mt-8 max-w-lg">
            No call centre and no chatbot. Messages go to the atelier, and the person who answers is
            usually the person who would make the piece.
          </p>
        </Reveal>
      </div>

      {/* form + details */}
      <section className="shell grid gap-14 py-16 lg:grid-cols-12 lg:gap-16 md:py-20">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal>
            <div id="visit">
              <p className="eyebrow text-gold-3">The salon</p>
              <p className="mt-5 text-[14px] leading-relaxed opacity-70">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.country}
              </p>
              <p className="mt-4 text-[13px] opacity-50">By appointment, and walk-ins if we are free.</p>
            </div>

            <div className="mt-10">
              <p className="eyebrow text-gold-3">The atelier</p>
              <p className="mt-5 text-[14px] leading-relaxed opacity-70">
                {site.atelier.line1}
                <br />
                {site.atelier.line2}
              </p>
              <p className="mt-4 text-[13px] opacity-50">
                Visits by arrangement — we will show you the bench.
              </p>
            </div>

            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-6 py-4">
                  <dt className="text-[13.5px] opacity-50">{h.days}</dt>
                  <dd className="text-[13.5px]">{h.time}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-[13.5px] opacity-50">Telephone</dt>
                <dd className="text-[13.5px]">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-line">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-[13.5px] opacity-50">WhatsApp</dt>
                <dd className="text-[13.5px]">
                  <a
                    href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-line"
                  >
                    {site.whatsapp}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="text-[13.5px] opacity-50">Email</dt>
                <dd className="text-[13.5px]">
                  <a href={`mailto:${site.email}`} className="link-line">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex gap-6">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-line eyebrow text-[9px] opacity-55"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* salon image */}
      <section className="shell pb-16 md:pb-24">
        <ImageReveal
          src="/images/gold-chains-rail.jpg"
          alt="Inside the Ritza atelier"
          className="aspect-[21/9] w-full"
          sizes="100vw"
          drift={44}
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow text-[9px] opacity-45">
            The atelier — Al Quoz Industrial 3, Dubai
          </p>
          <a
            href="https://maps.google.com/?q=Alserkal+Avenue+Dubai"
            target="_blank"
            rel="noreferrer"
            className="link-line eyebrow text-[9px] text-gold-3"
          >
            Open in maps
          </a>
        </div>
      </section>

      {/* services */}
      <section className="bg-ivory-2 py-16 md:py-20" id="care">
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
        </div>
      </section>

      {/* faq */}
      <section className="py-16 md:py-24" id="faq">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow text-gold-3">Questions</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)]">
                Answered before you ask
              </h2>
              <p className="lede mt-6">
                If yours is not here,{" "}
                <Link href="#visit" className="link-line">
                  write to us
                </Link>{" "}
                — we answer within a working day.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6" id="shipping">
            <Reveal delay={0.1}>
              <Accordion
                defaultOpen={0}
                items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))}
              />
            </Reveal>
            <div id="sizing" className="mt-14 border-t border-ink/10 pt-10">
              <p className="eyebrow text-gold-3">Sizing</p>
              <p className="lede mt-5">
                Rings are quoted in European sizes — the inside circumference in millimetres. If you
                are unsure, we will send a sizer, or measure you in the salon in two minutes.
              </p>
              <dl className="mt-7 grid grid-cols-3 gap-4 text-[13px] sm:grid-cols-6">
                {[
                  ["48", "15.3mm"],
                  ["50", "15.9mm"],
                  ["52", "16.6mm"],
                  ["54", "17.2mm"],
                  ["56", "17.8mm"],
                  ["58", "18.5mm"],
                ].map(([size, mm]) => (
                  <div key={size} className="border border-ink/12 p-3 text-center">
                    <dt className="display text-xl">{size}</dt>
                    <dd className="mt-1 text-[11.5px] opacity-50">{mm}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
