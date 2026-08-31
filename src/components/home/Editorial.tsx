"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, TextReveal, Marquee, EASE } from "@/components/ui/motion";
import { pressQuotes } from "@/lib/data/site";

/* The brand story, told against the house navy. Two frames at different
   speeds either side of the copy, then the press line running underneath. */

const FIGURES = [
  { value: "2016", label: "Founded in Dubai" },
  { value: "18k", label: "Gold, never plated" },
  { value: "11", label: "Hands in the atelier" },
  { value: "100%", label: "Finished by hand" },
];

export function Editorial() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-50, 90]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-ivory">
      <div className="shell py-24 md:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            className="relative lg:col-span-4"
            style={reduce ? undefined : { y: leftY }}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ink-2">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, ease: EASE }}
              >
                <Image
                  src="/images/gold-jewels-plate.jpg"
                  alt="Gold pieces laid out in the atelier"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/70" />
                <span className="eyebrow text-gold-2">The house</span>
              </div>
            </Reveal>

            <h2 className="display mt-6 text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">
              <TextReveal text="Made where it is sold" />
            </h2>

            <Reveal delay={0.12}>
              <p className="lede mt-8 text-ivory/60">
                Ritza opened in 2016 with one bench and a stubborn idea: that a Dubai house could
                hold itself to Geneva&apos;s standards without pretending to be Swiss. Everything we
                sell is cast, set and finished in Al Quoz, eleven minutes from the salon floor.
              </p>
              <p className="lede mt-5 text-ivory/60">
                We do not run seasons. A piece enters the collection when it is right, and leaves
                when we can no longer make it as well as we did the first time.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <blockquote className="border-l border-gold/40 pl-6">
                <p className="display text-2xl leading-snug text-ivory/90 italic md:text-[1.75rem]">
                  “If you cannot see the hand in it, we have not finished.”
                </p>
                <footer className="eyebrow mt-4 text-[9px] text-ivory/40">
                  Head of atelier, Al Quoz
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.26} className="mt-10">
              <ButtonLink href="/about" variant="outline-light">
                Our story
              </ButtonLink>
            </Reveal>
          </div>

          <motion.div
            className="relative lg:col-span-4"
            style={reduce ? undefined : { y: rightY }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, delay: 0.1, ease: EASE }}
              >
                <Image
                  src="/images/portrait-pearls-bw.jpg"
                  alt="A pearl strand and drop earrings worn in profile, house campaign"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* figures */}
        <div className="mt-20 grid grid-cols-2 gap-y-10 border-t border-ivory/10 pt-12 md:grid-cols-4">
          {FIGURES.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.07}>
              <p className="display text-4xl text-gold-2 md:text-5xl">{f.value}</p>
              <p className="eyebrow mt-3 text-[9px] text-ivory/45">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* press */}
      <div className="border-t border-ivory/10 py-6">
        <Marquee speed={52}>
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
  );
}
