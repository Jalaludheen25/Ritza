"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

/* ---------------------------------------------------------------- Stars */
export function Stars({
  rating,
  className,
  size = 12,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[3px]", className)} aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 12 12" aria-hidden className="shrink-0">
            <defs>
              <linearGradient id={`st-${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M6 0.6 7.5 4.2 11.4 4.5 8.4 7 9.3 10.8 6 8.8 2.7 10.8 3.6 7 0.6 4.5 4.5 4.2Z"
              fill={`url(#st-${i}-${Math.round(fill * 100)})`}
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinejoin="round"
              opacity={fill > 0 ? 1 : 0.35}
            />
          </svg>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------- Quantity */
export function Quantity({
  value,
  onChange,
  min = 1,
  max = 10,
  className,
  tone = "ink",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
  tone?: "ink" | "ivory";
}) {
  const border = tone === "ink" ? "border-ink/15" : "border-ivory/25";
  return (
    <div className={cn("inline-flex items-center border", border, className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-11 w-11 place-items-center text-lg font-light transition-opacity hover:opacity-55 disabled:opacity-20"
      >
        −
      </button>
      <span className="w-8 text-center text-[13px] tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-11 w-11 place-items-center text-lg font-light transition-opacity hover:opacity-55 disabled:opacity-20"
      >
        +
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ Accordion */
export function Accordion({
  items,
  defaultOpen = -1,
  className,
  tone = "ink",
}: {
  items: { title: string; content: ReactNode }[];
  defaultOpen?: number;
  className?: string;
  tone?: "ink" | "ivory";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const line = tone === "ink" ? "border-ink/12" : "border-ivory/15";

  return (
    <div className={cn("border-t", line, className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title} className={cn("border-b", line)}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="eyebrow">{item.title}</span>
              <span className="relative h-3 w-3 shrink-0">
                <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                <span
                  className={cn(
                    "absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen && "scale-y-0",
                  )}
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[13.5px] leading-relaxed opacity-70">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Badge */
export function Badge({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "ivory" | "gold";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink/85 text-ivory",
    ivory: "bg-ivory/90 text-ink",
    gold: "bg-gold text-ink",
  };
  return (
    <span
      className={cn(
        "eyebrow inline-flex h-6 items-center px-2.5 text-[9px] backdrop-blur-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Gloss
   Collection name in Arabic beside its English meaning. The Arabic sits in
   its own span so it escapes the eyebrow's tracking and uppercasing. */
export function Gloss({
  arabic,
  meaning,
  className,
}: {
  arabic?: string;
  meaning: string;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2.5", className)}>
      {arabic && (
        <>
          <span className="arabic" lang="ar">
            {arabic}
          </span>
          <span aria-hidden className="opacity-40">
            —
          </span>
        </>
      )}
      <span>{meaning}</span>
    </p>
  );
}

/* -------------------------------------------------------- SectionHeading
   Eyebrow, rule and heading — the section opener used across the site. */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "ink",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "ivory";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <div className="mb-5 flex items-center gap-3">
            <span className={cn("h-px w-8", tone === "ink" ? "bg-gold-3/60" : "bg-gold/70")} />
            <span className={cn("eyebrow", tone === "ink" ? "text-gold-3" : "text-gold-2")}>
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="display text-[clamp(2rem,1.2rem+3.4vw,4.25rem)]">{title}</h2>
      </div>
      {action && <div className="shrink-0 md:pb-2">{action}</div>}
    </div>
  );
}
