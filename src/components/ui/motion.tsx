"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

const REVEAL_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
  figure: motion.figure,
} as const;

/* ---------------------------------------------------------------- Reveal
   The workhorse: content rises a few pixels into place, once, on entry. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  duration = 0.9,
  once = true,
  amount = 0.25,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  as?: keyof typeof REVEAL_TAGS;
}) {
  const reduce = useReducedMotion();
  const MotionTag = REVEAL_TAGS[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------ TextReveal
   Splits a heading into words and lifts them out of a mask. Used sparingly,
   on the one heading per section that carries the section. */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once, amount: 0.4 }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
            aria-hidden
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------- Parallax
   Shifts a layer against the scroll. Kept small — 40 to 90px of travel. */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Progress of an element through the viewport, for bespoke scroll effects. */
export function useSectionProgress(offset: ["start end", "end start"] | ["start start", "end start"] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return { ref, progress: scrollYProgress as MotionValue<number> };
}

/* -------------------------------------------------------------- Magnetic
   Buttons lean very slightly towards the cursor. Desktop only. */
export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 16, mass: 0.3 });
  const y = useSpring(0, { stiffness: 180, damping: 16, mass: 0.3 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------- Marquee */
export function Marquee({
  children,
  speed = 44,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative flex w-full overflow-hidden", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee"
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** True once the element has entered the viewport — for non-motion effects. */
export function useEntered(amount = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}
