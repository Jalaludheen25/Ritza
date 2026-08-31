"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, TextReveal, EASE } from "@/components/ui/motion";
import { getCollection } from "@/lib/data/collections";
import { Gloss } from "@/components/ui/bits";
import { byCollection } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

/* Editorial spotlight: one tall frame drifting against a second, smaller
   still that overlaps it, with the copy sitting off the optical centre. */

export function FeaturedCollection() {
  const collection = getCollection("noor")!;
  const pieces = byCollection("noor").slice(0, 2);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const tallY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const stillY = useTransform(scrollYProgress, [0, 1], [-40, 60]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* imagery */}
          <div className="relative lg:col-span-7">
            <motion.div
              style={reduce ? undefined : { y: tallY }}
              className="relative aspect-[4/5] w-full overflow-hidden bg-sand sm:aspect-[3/4] lg:aspect-[4/5]"
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.18 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.8, ease: EASE }}
              >
                <Image
                  src={collection.cover}
                  alt={`${collection.name} — the collection photographed on skin`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.span
                aria-hidden
                className="absolute inset-0 origin-bottom bg-ivory"
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.25, ease: EASE }}
              />
            </motion.div>

            <motion.div
              style={reduce ? undefined : { y: stillY }}
              className="absolute -right-4 -bottom-10 w-[38%] max-w-[280px] sm:-right-8 lg:-right-16"
            >
              <div className="relative aspect-square overflow-hidden bg-sand shadow-[0_40px_80px_-40px_rgba(6,16,39,0.45)]">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.5, delay: 0.25, ease: EASE }}
                >
                  <Image
                    src={collection.still}
                    alt=""
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* copy */}
          <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-3/60" />
                <span className="eyebrow text-gold-3">The featured collection</span>
              </div>
            </Reveal>

            <h2 className="display mt-6 text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)]">
              <TextReveal text={collection.name} />
            </h2>

            <Reveal delay={0.12}>
              <Gloss arabic={collection.arabic} meaning={collection.meaning} className="mt-4 text-ink/40" />
              <p className="lede mt-8">{collection.story}</p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <div className="grid grid-cols-2 gap-6 border-y border-ink/10 py-6">
                {pieces.map((p) => (
                  <Link key={p.slug} href={`/product/${p.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-sand">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="160px"
                        className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-[13px] leading-snug">{p.name}</p>
                    <p className="mt-0.5 text-[12px] opacity-50">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.26} className="mt-9">
              <ButtonLink href={`/collections/${collection.slug}`} variant="ink">
                Explore {collection.name}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
