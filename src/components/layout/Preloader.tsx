"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lockup } from "@/components/ui/Logo";
import { EASE } from "@/components/ui/motion";
import { lockScroll } from "./SmoothScroll";

/* First arrival only. The mark holds for a beat, a hairline fills beneath
   it, then the panel splits and lifts away. Skipped on later navigations
   in the same session. */

const SEEN_KEY = "ritza.entered";

export function Preloader() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    setShow(true);
    lockScroll(true);
    const t = setTimeout(() => {
      setShow(false);
      lockScroll(false);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode — the intro simply plays again next time */
      }
    }, 2150);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[120] flex items-center justify-center"
          exit={{ transition: { duration: 0 } }}
        >
          {/* two panels that part vertically */}
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute inset-x-0 h-1/2 bg-ivory-2"
              style={{ top: i === 0 ? 0 : "50%" }}
              initial={{ y: 0 }}
              exit={{ y: i === 0 ? "-100%" : "100%" }}
              transition={{ duration: 1.05, ease: EASE }}
            />
          ))}

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          >
            <Lockup tone="ink" priority className="w-[132px] md:w-[168px]" />
            <div className="mt-9 h-px w-32 overflow-hidden bg-ink/12">
              <motion.span
                className="block h-full w-full origin-left bg-gold"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.75, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <motion.p
              className="eyebrow mt-6 text-[9px] text-ink/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.9 }}
            >
              Fine jewellery — Dubai
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
