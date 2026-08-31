"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

/* Desktop: a thumbnail rail beside one large frame that cross-fades and can
   be zoomed by pointer position. Mobile: a snapping horizontal carousel. */

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIndex(0), [name]);

  return (
    <div className="min-w-0 lg:flex lg:gap-5">
      {/* rail */}
      <div className="hidden shrink-0 flex-col gap-3 lg:flex">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={i === index}
            className={cn(
              "relative aspect-[3/4] w-[74px] overflow-hidden bg-sand transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-45 hover:opacity-80",
            )}
          >
            <Image src={src} alt="" fill sizes="74px" className="object-cover" />
            {i === index && <span className="absolute inset-0 border border-ink" />}
          </button>
        ))}
      </div>

      {/* large frame */}
      <div className="hidden min-w-0 flex-1 lg:block">
        <div
          className={cn(
            "relative aspect-[4/5] w-full overflow-hidden bg-sand",
            zoom ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
          onClick={() => setZoom((z) => !z)}
          onMouseMove={(e) => {
            if (!zoom) return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={images[index]}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Image
                src={images[index]}
                alt={`${name} — view ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: zoom ? "scale(1.9)" : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
              />
            </motion.div>
          </AnimatePresence>

          <span className="eyebrow pointer-events-none absolute bottom-4 left-4 bg-ivory/85 px-2.5 py-1.5 text-[9px] backdrop-blur-sm">
            {zoom ? "Click to zoom out" : "Click to zoom"}
          </span>
          <span className="eyebrow pointer-events-none absolute right-4 bottom-4 text-[9px] text-ink/45 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* mobile carousel */}
      <div className="min-w-0 lg:hidden">
        <div
          ref={scrollerRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="hide-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-[4/5] w-screen shrink-0 snap-center bg-sand">
              <Image
                src={src}
                alt={`${name} — view ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => {
                const el = scrollerRef.current;
                el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
              }}
              className={cn(
                "h-[3px] w-8 transition-colors duration-500",
                i === index ? "bg-ink" : "bg-ink/18",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
