"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/ui/motion";

/* Route changes cross-fade with a short lift, and a hairline of gold runs
   across the top while the next page settles. Deliberately quick — the
   transition should never be the thing you remember. */

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          id="main"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={`bar-${pathname}`}
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[115] h-px origin-left bg-gold"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ scaleX: { duration: 0.75, ease: EASE }, opacity: { delay: 0.7, duration: 0.3 } }}
        />
      </AnimatePresence>
    </>
  );
}
