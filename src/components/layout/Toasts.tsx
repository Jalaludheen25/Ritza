"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { EASE } from "@/components/ui/motion";

export function Toasts() {
  const { toasts, dismissToast, setCartOpen } = useStore();

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[107] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="pointer-events-auto flex items-center gap-3 bg-ink py-3 pr-3 pl-3 text-ivory shadow-[0_18px_50px_-20px_rgba(6,16,39,0.6)]"
          >
            {t.image && (
              <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-ink-2">
                <Image src={t.image} alt="" fill sizes="44px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[9px] text-gold-2">{t.title}</p>
              {t.body && <p className="mt-1 truncate text-[13px] text-ivory/85">{t.body}</p>}
            </div>
            {t.title === "Added to bag" && (
              <button
                type="button"
                onClick={() => {
                  setCartOpen(true);
                  dismissToast(t.id);
                }}
                className="eyebrow shrink-0 border border-ivory/25 px-3 py-2 text-[9px] transition-colors hover:bg-ivory hover:text-ink"
              >
                View
              </button>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="grid h-7 w-7 shrink-0 place-items-center opacity-50 transition-opacity hover:opacity-100"
            >
              <span className="relative block h-3 w-3">
                <span className="absolute top-1/2 left-0 h-px w-3 rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-3 -rotate-45 bg-current" />
              </span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
