"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./motion";

/* Images arrive the same way everywhere: a curtain lifts off the frame while
   the picture settles back from a slight over-scale. Optional slow drift
   against the scroll for full-bleed frames. */

export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority,
  delay = 0,
  drift = 0,
  hoverZoom = false,
  quality,
  fill = true,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
  /** px of parallax travel across the viewport; 0 disables */
  drift?: number;
  hoverZoom?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const y = useSpring(rawY, { stiffness: 80, damping: 26, mass: 0.4 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={drift && !reduce ? { y, scale: 1.12 } : undefined}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: drift ? 1.2 : 1.14 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: drift ? 1.12 : 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.5, delay, ease: EASE }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn(
            "h-full w-full object-cover",
            hoverZoom &&
              "transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]",
            imageClassName,
          )}
        />
      </motion.div>

      {/* the curtain */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 z-10 origin-bottom bg-ivory-2"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.15, delay, ease: EASE }}
        />
      )}
    </div>
  );
}
