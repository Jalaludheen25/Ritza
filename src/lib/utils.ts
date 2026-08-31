import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Dubai storefront — everything is quoted in dirhams. */
export function formatPrice(value: number) {
  return `AED ${value.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

export function formatCompact(value: number) {
  return value.toLocaleString("en-AE", { maximumFractionDigits: 0 });
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function titleCase(s: string) {
  return s.replace(/(^|[\s-])\w/g, (m) => m.toUpperCase()).replace(/-/g, " ");
}
