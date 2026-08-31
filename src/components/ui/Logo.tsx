import Image from "next/image";
import { cn } from "@/lib/utils";

/* The supplied brand mark, in its three lock-ups. Never re-set in type. */

type Tone = "ink" | "ivory";

const WORDMARK: Record<Tone, string> = {
  ink: "/brand/ritza-wordmark.png",
  ivory: "/brand/ritza-wordmark-light.png",
};
const MONOGRAM: Record<Tone, string> = {
  ink: "/brand/ritza-monogram.png",
  ivory: "/brand/ritza-monogram-light.png",
};
const LOCKUP: Record<Tone, string> = {
  ink: "/brand/ritza-lockup.png",
  ivory: "/brand/ritza-lockup-light.png",
};

export function Wordmark({
  tone = "ink",
  className,
  priority,
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={WORDMARK[tone]}
      alt="Ritza"
      width={900}
      height={337}
      priority={priority}
      sizes="(max-width: 768px) 120px, 160px"
      className={cn("h-auto w-auto select-none object-contain", className)}
    />
  );
}

export function Monogram({
  tone = "ink",
  className,
  priority,
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={MONOGRAM[tone]}
      alt="Ritza"
      width={446}
      height={454}
      priority={priority}
      sizes="64px"
      className={cn("h-auto w-auto select-none object-contain", className)}
    />
  );
}

export function Lockup({
  tone = "ink",
  className,
  priority,
}: {
  tone?: Tone;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOCKUP[tone]}
      alt="Ritza — fine jewellery, Dubai"
      width={900}
      height={628}
      priority={priority}
      sizes="(max-width: 768px) 200px, 300px"
      className={cn("h-auto w-auto select-none object-contain", className)}
    />
  );
}
