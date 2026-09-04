"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, TextReveal, EASE } from "@/components/ui/motion";
import { clamp } from "@/lib/utils";

/* The try-on, shown rather than described: drag the handle and the piece
   appears on the photograph. The frames either side are the real output of
   the same renderer the product page uses. */

const STEPS = [
  { n: "01", title: "Upload a photograph", body: "Front-on, shoulders in frame. Nothing is uploaded — it stays on your device." },
  { n: "02", title: "We place the piece", body: "Scaled against the measurements in the specification, not guessed at." },
  { n: "03", title: "Adjust, then decide", body: "Drag to reposition, scale to your frame, and add it to the bag from there." },
];

export function TryOnShowcase() {
  const [split, setSplit] = useState(52);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSplit(clamp(((clientX - r.left) / r.width) * 100, 4, 96));
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink-deep py-24 text-ivory md:py-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* interactive frame */}
          <Reveal className="lg:col-span-6" y={40}>
            <div
              ref={frameRef}
              className="relative aspect-[4/5] w-full cursor-ew-resize overflow-hidden bg-ink select-none"
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                move(e.clientX);
              }}
              onPointerMove={(e) => dragging.current && move(e.clientX)}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <Image
                src="/images/tryon-before.jpg"
                alt="A guest photograph before the piece is placed"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />

              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
              >
                <Image
                  src="/images/tryon-after.jpg"
                  alt="The same photograph with the Noor pendant rendered in place"
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>

              {/* handle */}
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-ivory/80"
                style={{ left: `${split}%` }}
              >
                <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/60 bg-ink/40 backdrop-blur-sm">
                  <span className="flex items-center gap-1 text-ivory">
                    <Chevron className="rotate-180" />
                    <Chevron />
                  </span>
                </span>
              </div>

              <span className="eyebrow absolute top-4 left-4 z-10 bg-ink/50 px-2.5 py-1.5 text-[9px] text-ivory/80 backdrop-blur-sm">
                Before
              </span>
              <span className="eyebrow absolute top-4 right-4 z-10 bg-gold px-2.5 py-1.5 text-[9px] text-ink">
                Rendered
              </span>

              {/* scanning line, purely decorative */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-gold/12 to-transparent"
                animate={{ top: ["-15%", "105%"] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
              />
            </div>
            <p className="eyebrow mt-4 text-[9px] text-ivory/35">
              Drag to compare — Kasu Mala Necklace
            </p>
          </Reveal>

          {/* copy */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/70" />
                <span className="eyebrow text-gold-2">Ritza Try-On</span>
              </div>
            </Reveal>

            <h2 className="display mt-6 text-[clamp(2.25rem,1.4rem+3.4vw,4.25rem)]">
              <TextReveal text="See it on you," />
              <br />
              <em className="font-normal italic">
                <TextReveal text="before it ships" delay={0.12} />
              </em>
            </h2>

            <Reveal delay={0.15}>
              <p className="lede mt-8 text-ivory/60">
                Proportion is the hardest thing to judge from a product photograph. Upload a picture
                and we will place the piece on it at true scale, so a 24mm hoop looks like a 24mm
                hoop on your face and not on a model&apos;s.
              </p>
            </Reveal>

            <ol className="mt-10 space-y-7">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.n} delay={0.2 + i * 0.08}>
                  <div className="flex gap-5">
                    <span className="eyebrow shrink-0 pt-1 text-[9px] text-gold-2">{s.n}</span>
                    <div className="border-l border-ivory/12 pl-5">
                      <p className="text-[15px]">{s.title}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/50">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.45} className="mt-11">
              <ButtonLink href="/product/kasu-mala-necklace?tryon=1" variant="ivory">
                Try this piece on
              </ButtonLink>
              <p className="eyebrow mt-5 text-[9px] text-ivory/30">
                Demonstration only — images never leave your browser
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden className={className}>
      <path d="M1.5 1 5.5 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
