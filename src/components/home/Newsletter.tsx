"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, TextReveal, Parallax, EASE } from "@/components/ui/motion";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/site";

export function Services() {
  return (
    <section className="bg-ivory py-16 md:py-20">
      <div className="shell">
        <div className="grid gap-y-10 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
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
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-ink py-28 text-ivory md:py-40">
      <Parallax distance={70} className="absolute inset-0 -z-10">
        <div className="relative h-[130%] w-full">
          <Image
            src="/images/gold-bokeh-texture.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
        </div>
      </Parallax>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90" />

      <div className="shell relative text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/70" />
            <span className="eyebrow text-gold-2">The letter</span>
            <span className="h-px w-8 bg-gold/70" />
          </div>
        </Reveal>

        <h2 className="display mx-auto mt-7 max-w-3xl text-[clamp(2.25rem,1.3rem+4vw,4.75rem)]">
          <TextReveal text="Six letters a year," />
          <br />
          <em className="font-normal italic">
            <TextReveal text="never a seventh" delay={0.1} />
          </em>
        </h2>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-7 max-w-lg text-[14.5px] leading-relaxed text-ivory/60">
            New pieces before they reach the salon floor, notes from the bench, and first refusal on
            anything we make in a run of ten or fewer.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <form
            className="mx-auto mt-11 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              setDone(true);
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="field field-dark flex-1 text-center sm:text-left"
            />
            <Button type="submit" variant="ivory" className="shrink-0">
              Subscribe
            </Button>
          </form>

          {done && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="eyebrow mt-5 text-[9px] text-gold-2"
            >
              Welcome — please confirm from your inbox
            </motion.p>
          )}

          <p className="eyebrow mt-6 text-[9px] text-ivory/30">
            Unsubscribe in one click. We never share an address.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
