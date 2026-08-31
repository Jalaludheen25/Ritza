"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/* Lenis drives every scroll on the site, so parallax and pinning stay in
   step with the page. One instance, held on the module so overlays can
   pause it while they are open. */

let lenis: Lenis | null = null;

export const getLenis = () => lenis;

export function lockScroll(locked: boolean) {
  if (!lenis) {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    return;
  }
  if (locked) lenis.stop();
  else lenis.start();
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  /* New route, top of page — before paint, so it never reads as a jump. */
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
