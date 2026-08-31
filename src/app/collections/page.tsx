import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collections/CollectionIndex";
import { Reveal, TextReveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Five collections — Noor, Dune, Lulua, Mirage and Vow — each with its own reason for existing.",
};

export default function CollectionsPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell pb-14">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">Five collections</span>
          </div>
        </Reveal>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.5rem,1.5rem+4.4vw,5.5rem)]">
          <TextReveal text="Each one starts" />
          <br />
          <em className="font-normal italic">
            <TextReveal text="with a reason" delay={0.1} />
          </em>
        </h1>
        <Reveal delay={0.15}>
          <p className="lede mt-8 max-w-lg">
            We do not launch a collection to fill a season. Each of these began as a question
            somebody in the atelier could not stop asking.
          </p>
        </Reveal>
      </div>

      <CollectionIndex />
    </div>
  );
}
