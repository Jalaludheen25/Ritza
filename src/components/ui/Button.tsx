"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* One button, four tones. The fill sweeps up from the baseline on hover —
   the only "effect" in the system, reused everywhere so it reads as a rule. */

type Variant = "ink" | "ivory" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center overflow-hidden isolate select-none " +
  "eyebrow whitespace-nowrap transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[10px]",
  md: "h-12 px-7",
  lg: "h-14 px-10",
};

const variants: Record<Variant, string> = {
  ink: "bg-ink text-ivory hover:text-ink",
  ivory: "bg-ivory text-ink hover:text-ivory",
  outline: "border border-ink/25 text-ink hover:text-ivory hover:border-ink",
  "outline-light": "border border-ivory/35 text-ivory hover:text-ink hover:border-ivory",
  ghost: "text-ink hover:text-gold-3",
};

const sweeps: Record<Variant, string> = {
  ink: "bg-gold",
  ivory: "bg-ink",
  outline: "bg-ink",
  "outline-light": "bg-ivory",
  ghost: "bg-transparent",
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-[600ms]",
          "ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:scale-y-100",
          sweeps[variant],
        )}
      />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </>
  );
}

export function Button({
  children,
  variant = "ink",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "ink",
  size = "md",
  className,
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

/** Text link with the house underline. */
export function TextLink({
  children,
  className,
  href,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn("link-line eyebrow", className)} {...props}>
      {children}
    </Link>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      fill="none"
      aria-hidden
      className={cn("h-2 w-5 overflow-visible", className)}
    >
      <path
        d="M0 6h22M17 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
