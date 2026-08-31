"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink, ArrowRight } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

/* Full-bleed opening frame. The picture settles out of a slow over-scale
   while the title lifts out of its mask, then drifts a little slower than
   the page as you leave it. */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const featured = getProduct("lulua-pearl-strand")!;

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imageY, scale: imageScale }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.16, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.15 }}
        >
          <Image
            src="/images/model-gold-bokeh.jpg"
            alt="A model wearing layered Ritza gold against evening light"
            fill
            priority
            quality={88}
            sizes="100vw"
            className="object-cover object-[58%_center]"
          />
        </motion.div>
      </motion.div>

      {/* grading */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />

      <motion.div
        className="shell relative flex h-full flex-col justify-end pb-16 md:pb-20"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <div className="max-w-4xl">
          <motion.div
            className="mb-7 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 1 }}
          >
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-gold-2">Lulua — Gulf pearls</span>
          </motion.div>

          <h1 className="display text-ivory text-[clamp(2.75rem,1.4rem+6.6vw,7.5rem)]">
            {["Light, held", "at the throat"].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.35, delay: 0.4 + i * 0.12, ease: EASE }}
                >
                  {i === 1 ? (
                    <>
                      at the <em className="font-normal italic">throat</em>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-md text-[15px] leading-relaxed text-ivory/70"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 1.1, ease: EASE }}
          >
            South Sea pearls graded by hand and knotted on silk, one at a time, in the city that
            once lived on them. Finished in our Al Quoz atelier.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.1, ease: EASE }}
          >
            <ButtonLink href="/collections/lulua" variant="ivory" size="lg">
              Discover Lulua
            </ButtonLink>
            <ButtonLink href="/shop" variant="outline-light" size="lg">
              Shop all pieces
            </ButtonLink>
          </motion.div>
        </div>

        {/* featured piece card */}
        <motion.div
          className="absolute right-5 bottom-16 hidden xl:block"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.25, duration: 1.1, ease: EASE }}
        >
          <Link
            href={`/product/${featured.slug}`}
            className="group flex w-[268px] items-center gap-4 bg-ivory/8 p-3 backdrop-blur-md transition-colors duration-500 hover:bg-ivory/14"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden">
              <Image
                src={featured.images[1]}
                alt={featured.name}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[9px] text-gold-2">Worn here</p>
              <p className="mt-1.5 truncate text-[13.5px] text-ivory">{featured.name}</p>
              <p className="mt-1 text-[12px] text-ivory/55">{formatPrice(featured.price)}</p>
            </div>
            <ArrowRight className="mr-1 shrink-0 text-ivory/60 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="eyebrow text-[9px] text-ivory/45">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-ivory/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gold"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
