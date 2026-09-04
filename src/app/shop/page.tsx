import type { Metadata } from "next";
import { ShopView, type ShopFilters } from "@/components/shop/ShopView";
import { Reveal, TextReveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Forty pieces across Ritza Anti-Tarnish and Kerala Traditional — filter by category, collection, finish, stone and price.",
};

const list = (v: string | string[] | undefined) =>
  typeof v === "string" && v ? v.split(",").filter(Boolean) : [];
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const initial: Partial<ShopFilters> = {
    category: one(sp.category) ?? "all",
    collections: list(sp.collection),
    finishes: list(sp.finish ?? sp.metal),
    stones: list(sp.stone),
    max: sp.max ? Number(one(sp.max)) : undefined,
    sort: one(sp.sort) as ShopFilters["sort"] | undefined,
    edit: one(sp.edit) ?? "",
    q: one(sp.q) ?? "",
  };

  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell pb-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">The collection</span>
          </div>
        </Reveal>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.5rem,1.5rem+4.4vw,5.5rem)]">
          <TextReveal text="Forty-two pieces," />
          <br />
          <em className="font-normal italic">
            <TextReveal text="two ways to wear them" delay={0.1} />
          </em>
        </h1>
        <Reveal delay={0.15}>
          <p className="lede mt-8 max-w-md">
            Everything Ritza makes, across both lines. Start with a line, narrow by category, or
            filter on finish, stone and price.
          </p>
        </Reveal>
      </div>

      <ShopView initial={initial} />
    </div>
  );
}
