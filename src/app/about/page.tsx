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
    "Ritza sells two lines from one Dubai workshop — 316L anti-tarnish steel, and Kerala temple jewellery cast in Thrissur.",
};

const TIMELINE = [
  {
    year: "2019",
    title: "A stall in Meena Bazaar",
    body: "Ritza starts as one counter selling Kerala temple jewellery to the Malayali community in Bur Dubai — pieces brought over in a suitcase, four times a year.",
  },
  {
    year: "2020",
    title: "Thrissur, directly",
    body: "We stop buying through middlemen and start working with two families of goldsmiths who still cut their own dies. Prices drop; quality does not.",
  },
  {
    year: "2021",
    title: "The green-wrist problem",
    body: "The complaint we hear every August: it turned my skin green. Gulf humidity destroys plated brass, and plated brass is what fashion jewellery is.",
  },
  {
    year: "2023",
    title: "Ritza Anti-Tarnish",
    body: "We stop plating. The second line launches in solid 316L surgical steel under an 18k gold PVD bond — the process used on watch cases, measured in microns.",
  },
  {
    year: "2025",
    title: "Online, across the GCC",
    body: "The site opens. Same-day in Dubai, next day nationwide, and the traditional line finally reachable without a flight home.",
  },
  {
    year: "2026",
    title: "Forty-two pieces",
    body: "Two lines, thirteen categories, and a workshop in Al Quoz that sizes, restrings and repairs anything we have ever sold.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Honest about materials",
    body: "Anti-Tarnish is 316L steel with 18k gold PVD. Kerala Traditional is gold-plated brass. Neither is solid gold and we will never let you think otherwise.",
  },
  {
    n: "02",
    title: "The plating is the product",
    body: "2.5 microns of PVD, not the 0.1 micron flash most fashion jewellery ships with. That single number is the difference between two years and two months.",
  },
  {
    n: "03",
    title: "The old patterns, unaltered",
    body: "Nagapadam, palakka, kasu, mullamottu. We do not modernise the proportions to save metal — get them wrong and every grandmother in the room knows.",
  },
  {
    n: "04",
    title: "Fixed here, not shipped away",
    body: "Sizing, restringing and repair happen in Al Quoz. Bring a piece in on a Tuesday and most things are done the same week.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeaderTone tone="light" />

      {/* hero */}
      <section className="relative h-[86svh] min-h-[540px] overflow-hidden bg-ink">
        <Image
          src="/images/kt-necklace-jasmine.jpg"
          alt="A Kerala temple necklace worn with jasmine"
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
              <span className="eyebrow text-gold-2">The house — since 2019</span>
            </div>
          </Reveal>
          <h1 className="display mt-7 max-w-5xl text-ivory text-[clamp(2.5rem,1.4rem+5.4vw,6.5rem)]">
            <TextReveal text="Eleven minutes from" />
            <br />
            <em className="font-normal italic">
              <TextReveal text="workshop in Al Quoz" delay={0.1} />
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
Two problems, seven years apart, and the same answer both times.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <p className="lede">
                The first was distance. The Malayali community here is enormous, and until recently
                buying a proper kasu mala meant waiting for a trip home or trusting a suitcase.
                We fixed that by working directly with two goldsmith families in Thrissur.
              </p>
              <p className="lede mt-5">
                The second was chemistry. Every summer the same complaint came back — it turned my
                skin green. Gulf humidity eats plated brass, so for the everyday line we stopped
                plating altogether and moved to solid steel under a PVD bond.
              </p>
              <p className="lede mt-5">
                What you get is two lines that do not pretend to be each other. One is ceremonial
                and made the slow way. The other you can wear in the sea. Both are finished, sized
                and repaired in the same Al Quoz workshop.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* two frames */}
      <section className="shell grid gap-6 pb-20 md:grid-cols-12 md:gap-8 md:pb-32">
        <ImageReveal
          src="/images/kt-jhumka-stand.jpg"
          alt="Jumukka on the bench in the workshop"
          className="aspect-[4/5] md:col-span-7"
          sizes="(max-width: 768px) 100vw, 58vw"
          drift={40}
        />
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <ImageReveal
            src="/images/at-hoop-studio.jpg"
            alt="Anti-tarnish hoops, a day's output"
            className="aspect-square"
            sizes="(max-width: 768px) 100vw, 30vw"
            delay={0.15}
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-[13px] leading-relaxed opacity-55">
              Every piece is checked twice before it is boxed — once by the person who finished it,
              once by the person whose only job is to disagree with them.
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

      {/* campaign parallax */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <Parallax distance={80} className="absolute inset-0">
          <div className="relative h-[130%] w-full">
            <Image
              src="/images/kt-choker-ornate.jpg"
              alt="A kundan choker photographed for the house campaign"
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
                “If it cannot survive a Dubai summer, it is not jewellery. It is a souvenir.”
              </p>
              <footer className="eyebrow mt-6 text-[9px] text-ivory/50">
                Founder, Ritza — Bur Dubai
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
                  <dt className="eyebrow text-[9px] opacity-45">Workshop</dt>
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
