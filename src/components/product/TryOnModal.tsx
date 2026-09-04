"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { Monogram } from "@/components/ui/Logo";
import { collectionName } from "@/lib/data/collections";
import { useStore } from "@/lib/store";
import { cn, clamp, formatPrice } from "@/lib/utils";
import { lockScroll } from "@/components/layout/SmoothScroll";
import { Portal } from "@/components/ui/Portal";

/* ------------------------------------------------------------------
   Ritza Try-On — front-end demonstration.

   Upload → render → adjust → add to bag. The "render" is a staged
   animation over a real composite: the piece is a black-ground plate
   dropped onto the photograph with `mix-blend-mode: screen`, which is
   how the production renderer will composite it too. No network call is
   made and the photograph never leaves the browser.
------------------------------------------------------------------ */

type Stage = "upload" | "processing" | "result";

const STEPS = [
  "Reading the photograph",
  "Finding the neckline",
  "Matching scale to specification",
  "Rendering the piece",
];

const ANCHOR_HINT: Record<string, string> = {
  neck: "Front-on, with your collarbone in frame",
  ear: "A three-quarter or side profile works best",
  hand: "Hand open, fingers slightly spread",
  wrist: "Wrist across the frame, palm down",
};

export function TryOnModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { addToCart } = useStore();
  const [stage, setStage] = useState<Stage>("upload");
  const [photo, setPhoto] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const tryOn = product.tryOn;
  const [pos, setPos] = useState({ x: tryOn?.x ?? 0.5, y: tryOn?.y ?? 0.6 });
  const [scale, setScale] = useState(tryOn?.scale ?? 0.45);
  const [rotation, setRotation] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const reset = useCallback(() => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
    setPhoto(null);
    setStage("upload");
    setStep(0);
    setError(null);
    setCompare(false);
    setPos({ x: tryOn?.x ?? 0.5, y: tryOn?.y ?? 0.6 });
    setScale(tryOn?.scale ?? 0.45);
    setRotation(0);
  }, [tryOn]);

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("That file is not an image — JPEG, PNG or HEIC, please.");
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        setError("That image is over 12MB. A smaller one will render faster.");
        return;
      }
      setError(null);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      const url = URL.createObjectURL(file);
      objectUrl.current = url;
      setPhoto(url);
      setStage("processing");
      setStep(0);
    },
    [],
  );

  /* staged "rendering" — the pacing is the point, there is no request */
  useEffect(() => {
    if (stage !== "processing") return;
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 620));
    const done = setTimeout(() => setStage("result"), STEPS.length * 620 + 420);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [stage]);

  const move = useCallback((clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: clamp((clientX - r.left) / r.width, 0.05, 0.95),
      y: clamp((clientY - r.top) / r.height, 0.05, 0.95),
    });
  }, []);

  if (!tryOn) return null;

  return (
    <Portal>
      <AnimatePresence>
        {open && (
        <motion.div
          className="fixed inset-0 z-[112] bg-ink-deep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          role="dialog"
          aria-label={`Try on the ${product.name}`}
        >
          <div className="flex h-full flex-col text-ivory">
            {/* bar */}
            <header className="flex shrink-0 items-center justify-between border-b border-ivory/10 px-5 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <Monogram tone="ivory" className="w-5" />
                <span className="eyebrow text-[9px] text-ivory/50">Ritza Try-On</span>
                <span className="eyebrow hidden bg-gold px-2 py-1 text-[8px] text-ink sm:block">
                  Demonstration
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close try-on"
                className="eyebrow flex items-center gap-3 text-[9px] transition-opacity hover:opacity-60"
              >
                Close
                <span className="relative block h-3.5 w-3.5">
                  <span className="absolute top-1/2 left-0 h-px w-3.5 rotate-45 bg-ivory" />
                  <span className="absolute top-1/2 left-0 h-px w-3.5 -rotate-45 bg-ivory" />
                </span>
              </button>
            </header>

            <div className="hide-scrollbar flex-1 overflow-y-auto">
              <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-12 lg:gap-12 lg:px-8">
                {/* stage */}
                <div className="lg:col-span-7">
                  <div
                    ref={frameRef}
                    className={cn(
                      "relative aspect-[4/5] w-full overflow-hidden bg-ink select-none",
                      stage === "result" && "cursor-grab active:cursor-grabbing",
                    )}
                    onPointerDown={(e) => {
                      if (stage !== "result") return;
                      dragging.current = true;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      move(e.clientX, e.clientY);
                    }}
                    onPointerMove={(e) => dragging.current && move(e.clientX, e.clientY)}
                    onPointerUp={() => (dragging.current = false)}
                    onPointerCancel={() => (dragging.current = false)}
                  >
                    {photo ? (
                      // the guest's own file — next/image would try to optimise a blob URL
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt="Your photograph"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <UploadZone
                        dragOver={dragOver}
                        setDragOver={setDragOver}
                        onFile={accept}
                        hint={ANCHOR_HINT[tryOn.anchor]}
                      />
                    )}

                    {/* the piece */}
                    {stage === "result" && !compare && (
                      <motion.img
                        src={tryOn.plate}
                        alt=""
                        aria-hidden
                        draggable={false}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, ease: EASE }}
                        className="pointer-events-none absolute origin-center mix-blend-screen"
                        style={{
                          left: `${pos.x * 100}%`,
                          top: `${pos.y * 100}%`,
                          width: `${scale * 100}%`,
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                      />
                    )}

                    {/* processing overlay */}
                    <AnimatePresence>
                      {stage === "processing" && (
                        <motion.div
                          className="absolute inset-0 bg-ink/45 backdrop-blur-[1px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <motion.span
                            aria-hidden
                            className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-gold/25 to-transparent"
                            animate={{ top: ["-12%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <div className="absolute inset-x-0 bottom-0 p-6">
                            <div className="flex items-center gap-3">
                              <span className="block h-3 w-3 animate-[ritza-spin_1.1s_linear_infinite] rounded-full border border-gold border-t-transparent" />
                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={step}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.3 }}
                                  className="eyebrow text-[9px] text-ivory/85"
                                >
                                  {STEPS[step]}
                                </motion.p>
                              </AnimatePresence>
                            </div>
                            <div className="mt-3 h-px w-full bg-ivory/15">
                              <motion.span
                                className="block h-full origin-left bg-gold"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: STEPS.length * 0.62 + 0.4, ease: "linear" }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {stage === "result" && (
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setCompare((v) => !v)}
                        className="eyebrow absolute top-4 right-4 z-10 bg-ink/55 px-3 py-2 text-[9px] backdrop-blur-sm transition-colors hover:bg-ink"
                      >
                        {compare ? "Show piece" : "Compare"}
                      </button>
                    )}
                  </div>

                  {stage === "result" && (
                    <p className="eyebrow mt-3 text-[9px] text-ivory/35">
                      Drag the piece to reposition
                    </p>
                  )}

                  {error && (
                    <p className="mt-3 text-[13px] text-gold-2">{error}</p>
                  )}
                </div>

                {/* controls */}
                <div className="lg:col-span-5">
                  <p className="eyebrow text-gold-2">{collectionName(product.collection)}</p>
                  <h2 className="display mt-3 text-[2rem] leading-none md:text-[2.5rem]">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-[13px] text-ivory/50">{product.tagline}</p>
                  <p className="display mt-4 text-2xl tabular-nums">{formatPrice(product.price)}</p>

                  <div className="my-7 h-px bg-ivory/10" />

                  <AnimatePresence mode="wait">
                    {stage === "upload" && (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p className="text-[14.5px] leading-relaxed text-ivory/70">
                          Add a photograph and we will place the {product.name.toLowerCase()} onto it
                          at the size it actually is.
                        </p>
                        <ul className="mt-6 space-y-2.5 text-[13px] text-ivory/45">
                          <li className="flex gap-3">
                            <span className="text-gold-2">—</span>
                            {ANCHOR_HINT[tryOn.anchor]}
                          </li>
                          <li className="flex gap-3">
                            <span className="text-gold-2">—</span>
                            Even, front-facing light; avoid hard shadow
                          </li>
                          <li className="flex gap-3">
                            <span className="text-gold-2">—</span>
                            Nothing is uploaded — rendering happens on this device
                          </li>
                        </ul>

                        <label className="mt-8 block">
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => accept(e.target.files?.[0])}
                          />
                          <span className="eyebrow inline-flex h-12 cursor-pointer items-center justify-center bg-ivory px-7 text-ink transition-colors duration-500 hover:bg-gold">
                            Choose a photograph
                          </span>
                        </label>
                      </motion.div>
                    )}

                    {stage === "processing" && (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="text-[14.5px] leading-relaxed text-ivory/70">
                          Rendering the piece onto your photograph.
                        </p>
                        <ol className="mt-6 space-y-3">
                          {STEPS.map((s, i) => (
                            <li
                              key={s}
                              className={cn(
                                "flex items-center gap-3 text-[13px] transition-colors duration-500",
                                i <= step ? "text-ivory/80" : "text-ivory/25",
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[8px]",
                                  i < step
                                    ? "border-gold bg-gold text-ink"
                                    : i === step
                                      ? "border-gold text-gold"
                                      : "border-ivory/20",
                                )}
                              >
                                {i < step ? "✓" : ""}
                              </span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </motion.div>
                    )}

                    {stage === "result" && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <p className="eyebrow text-gold-2">Rendered</p>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-ivory/70">
                          Adjust until it sits where it would sit. Scale is set from the
                          specification, so the proportion is true.
                        </p>

                        <div className="mt-7 space-y-6">
                          <Slider
                            label="Size"
                            value={scale}
                            min={tryOn.scale * 0.45}
                            max={tryOn.scale * 2.1}
                            step={0.005}
                            onChange={setScale}
                            format={(v) => `${(v / tryOn.scale).toFixed(2)}× true scale`}
                          />
                          <Slider
                            label="Rotation"
                            value={rotation}
                            min={-25}
                            max={25}
                            step={0.5}
                            onChange={setRotation}
                            format={(v) => `${v.toFixed(0)}°`}
                          />
                        </div>

                        <div className="mt-9 flex flex-col gap-2.5">
                          <Button
                            variant="ivory"
                            className="w-full"
                            onClick={() => {
                              addToCart(
                                { slug: product.slug, quantity: 1, size: product.sizes?.[2] },
                                { openDrawer: false },
                              );
                              onClose();
                            }}
                          >
                            Add to bag — {formatPrice(product.price)}
                          </Button>
                          <Button variant="outline-light" className="w-full" onClick={reset}>
                            Try another photograph
                          </Button>
                        </div>

                        <p className="eyebrow mt-6 text-[9px] leading-relaxed text-ivory/30">
                          A visual guide only. Colour and lustre vary with your screen and the
                          light in the room.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

function UploadZone({
  dragOver,
  setDragOver,
  onFile,
  hint,
}: {
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onFile: (f: File | undefined) => void;
  hint: string;
}) {
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "absolute inset-4 flex cursor-pointer flex-col items-center justify-center border border-dashed text-center transition-colors duration-500",
        dragOver ? "border-gold bg-gold/5" : "border-ivory/20 hover:border-ivory/40",
      )}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden className="opacity-40">
        <rect x="1" y="5" width="32" height="24" stroke="currentColor" />
        <circle cx="11" cy="13" r="2.6" stroke="currentColor" />
        <path d="M1 24l9-8 7 6 5-4 11 9" stroke="currentColor" />
      </svg>
      <p className="mt-5 text-[14px] text-ivory/70">Drop a photograph here</p>
      <p className="mt-1.5 text-[12.5px] text-ivory/35">or click to browse</p>
      <p className="eyebrow mt-6 max-w-[15rem] text-[9px] leading-relaxed text-ivory/25">{hint}</p>
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="eyebrow text-[9px] text-ivory/50">{label}</span>
        <span className="text-[12px] text-ivory/40 tabular-nums">
          {format ? format(value) : `${Math.round(pct)}%`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 w-full accent-[var(--color-gold)]"
      />
    </div>
  );
}
