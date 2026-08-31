import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeaderTone } from "@/lib/store";
import { Reveal, TextReveal, Parallax, Marquee } from "@/components/ui/motion";
import { ButtonLink } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { journal, pressQuotes, site } from "@/lib/data/site";
import { Lockup } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ritza is a Dubai jewellery house founded in 2016. Eleven people, one bench each, and everything finished by hand in Al Quoz.",
};

const TIMELINE = [
  {
    year: "2016",
    title: "One bench, Al Quoz",
    body: "Ritza opens with a single setter's bench and a rented safe, making commissions for people who had run out of patience with the malls.",
  },
  {
    year: "2018",
    title: "Vow",
    body: "The bridal collection arrives after two years of being asked for it. Every band made to size, engraved by hand, no charge.",
  },
  {
    year: "2019",
    title: "Noor",
    body: "Two years of failed prototypes end in a claw drawn from a single length of gold — thin enough to disappear, strong enough to hold.",
  },
  {
    year: "2020",
    title: "Lulua",
    body: "We start buying South Sea and Akoya pearls directly, and knotting every strand on silk in-house.",
  },
  {
    year: "2021",
    title: "The Alserkal salon",
    body: "A room of our own on Alserkal Avenue, by appointment, with the workshop eleven minutes away.",
  },
  {
    year: "2025",
    title: "Eleven hands",
    body: "Four setters, two polishers, a stringer, a caster, two designers and one person who does nothing but check.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Nothing plated",
    body: "18k throughout, or platinum. If a piece is white, it is white gold with rhodium we will renew for you, for free, forever.",
  },
  {
    n: "02",
    title: "One stone at a time",
    body: "Centre stones are bought singly and to a report. Melee comes through the Kimberley Process and is audited once a year.",
  },
  {
    n: "03",
    title: "Finished by hand",
    body: "Casting is a start, not a finish. Every surface is filed, sanded and polished by a person who signs for it.",
  },
  {
    n: "04",
    title: "Made near you",
    body: "Eleven minutes separate the salon from the bench. Anything can be altered, and most things can be altered while you wait.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeaderTone tone="light" />

      {/* hero */}
      <section className="relative h-[86svh] min-h-[540px] overflow-hidden bg-ink">
        <Image
          src="/images/dubai-palms-pool.jpg"
          alt="Dubai, late afternoon"
          fill
          priority
          quality={86}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/45" />

        <div className="shell relative flex h-full flex-col justify-end pb-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow text-gold-2">The house — since 2016</span>
            </div>
          </Reveal>
          <h1 className="display mt-7 max-w-5xl text-ivory text-[clamp(2.5rem,1.4rem+5.4vw,6.5rem)]">
            <TextReveal text="Eleven minutes from" />
            <br />
            <em className="font-normal italic">
              <TextReveal text="the bench to the box" delay={0.1} />
            </em>
          </h1>
        </div>
      </section>

      {/* opening */}
      <section className="bg-ivory py-20 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-gold-3">Why we started</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)]">
                Dubai buys more gold than almost anywhere. Almost none of it is made here.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <p className="lede">
                That was the sentence the house started from. The Gold Souk sells beautifully and
                buys beautifully, but the making had drifted elsewhere — to Italy, to India, to
                whoever could cast cheapest that quarter.
              </p>
              <p className="lede mt-5">
                We wanted the whole thing in one building: the wax, the cast, the setting, the
                polish, the person who tells you the stone is not good enough. It took three years
                to get all eleven of those jobs under one roof, and it is the only thing about
                Ritza we would refuse to change.
              </p>
              <p className="lede mt-5">
                What it buys you is unglamorous and enormous — a ring that can be altered on a
                Tuesday, a clasp that can be remade the same week, a chain that can be shortened
                while you have coffee downstairs.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* two frames */}
      <section className="shell grid gap-6 pb-20 md:grid-cols-12 md:gap-8 md:pb-32">
        <ImageReveal
          src="/images/gold-chains-rail.jpg"
          alt="Chains on the rail in the atelier"
          className="aspect-[4/5] md:col-span-7"
          sizes="(max-width: 768px) 100vw, 58vw"
          drift={40}
        />
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <ImageReveal
            src="/images/gold-jewels-plate-2.jpg"
            alt="A day's work laid out"
            className="aspect-square"
            sizes="(max-width: 768px) 100vw, 30vw"
            delay={0.15}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-[13px] leading-relaxed opacity-55">
              Everything that leaves the bench is laid out and checked twice — once by the person
              who made it, once by the person whose only job is to disagree with them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* principles */}
      <section className="bg-ink py-20 text-ivory md:py-28">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/70" />
              <span className="eyebrow text-gold-2">How we work</span>
            </div>
            <h2 className="display mt-6 max-w-2xl text-[clamp(2rem,1.3rem+3vw,3.75rem)]">
              Four rules we have never broken
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08} className="lg:border-l lg:border-ivory/12 lg:pl-8">
                <p className="eyebrow text-gold-2">{p.n}</p>
                <h3 className="display mt-4 text-2xl">{p.title}</h3>
                <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ivory/55">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 border-y border-ivory/10 py-6">
          <Marquee speed={54}>
            {pressQuotes.map((p) => (
              <span key={p.source} className="flex items-center gap-6 pr-16">
                <span className="text-[14px] text-ivory/55 italic">“{p.quote}”</span>
                <span className="eyebrow text-[9px] text-gold-2">{p.source}</span>
                <span className="h-1 w-1 rounded-full bg-ivory/25" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* timeline */}
      <section className="bg-ivory py-20 md:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-gold-3">The record</p>
            <h2 className="display mt-6 max-w-2xl text-[clamp(2rem,1.3rem+3vw,3.75rem)]">
              Nine years, in the order they happened
            </h2>
          </Reveal>

          <ol className="mt-16 border-t border-ink/10">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.05} className="border-b border-ink/10">
                <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-8">
                  <p className="display text-4xl text-gold-3 md:col-span-2 md:text-5xl">{t.year}</p>
                  <h3 className="display text-2xl md:col-span-4">{t.title}</h3>
                  <p className="max-w-xl text-[13.5px] leading-relaxed opacity-60 md:col-span-6">
                    {t.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* atelier parallax */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <Parallax distance={80} className="absolute inset-0">
          <div className="relative h-[130%] w-full">
            <Image
              src="/images/model-dance-dark.jpg"
              alt="Campaign photography for the house"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-ink/35" />
        <div className="shell relative flex h-full items-center">
          <Reveal>
            <blockquote className="max-w-2xl">
              <p className="display text-ivory text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-tight italic">
                “A piece should look better in five years than it did in the box. That is the whole
                brief.”
              </p>
              <footer className="eyebrow mt-6 text-[9px] text-ivory/50">
                Founder, Ritza — Dubai
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* journal */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p className="eyebrow text-gold-3">From the journal</p>
              <h2 className="display mt-5 text-[clamp(2rem,1.3rem+3vw,3.5rem)]">
                Longer things, written slowly
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {journal.map((j, i) => (
              <Reveal key={j.slug} delay={i * 0.08}>
                <article className="group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    <Image
                      src={j.image}
                      alt={j.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 32vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-[11.5px] opacity-45">
                    <span className="eyebrow text-[9px] text-gold-3">{j.category}</span>
                    <span>{j.date}</span>
                    <span>·</span>
                    <span>{j.readTime}</span>
                  </div>
                  <h3 className="display mt-3 text-2xl leading-snug">{j.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed opacity-60">{j.excerpt}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* visit */}
      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Lockup tone="ink" className="w-[120px]" />
              <h2 className="display mt-9 text-[clamp(2rem,1.3rem+3vw,3.5rem)]">
                Come and hold something
              </h2>
              <p className="lede mt-6 max-w-md">
                The salon runs by appointment so you get the room, the light and somebody who
                actually made what you are looking at.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="ink">
                  Book an appointment
                </ButtonLink>
                <ButtonLink href="/shop" variant="outline">
                  Browse first
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.1}>
              <dl className="divide-y divide-ink/10 border-y border-ink/10">
                <div className="flex justify-between gap-6 py-5">
                  <dt className="eyebrow text-[9px] opacity-45">Salon</dt>
                  <dd className="text-right text-[13.5px] leading-relaxed">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                  </dd>
                </div>
                <div className="flex justify-between gap-6 py-5">
                  <dt className="eyebrow text-[9px] opacity-45">Atelier</dt>
                  <dd className="text-right text-[13.5px] leading-relaxed">
                    {site.atelier.line1}
                    <br />
                    {site.atelier.line2}
                  </dd>
                </div>
                {site.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6 py-5">
                    <dt className="eyebrow text-[9px] opacity-45">{h.days}</dt>
                    <dd className="text-[13.5px]">{h.time}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-5">
                  <dt className="eyebrow text-[9px] opacity-45">Telephone</dt>
                  <dd className="text-[13.5px]">
                    <Link href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-line">
                      {site.phone}
                    </Link>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
