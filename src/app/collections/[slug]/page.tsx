import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/data/collections";
import { byCollection } from "@/lib/data/products";
import { ProductGrid } from "@/components/collections/ProductGrid";
import { Reveal, TextReveal, Parallax } from "@/components/ui/motion";
import { Gloss } from "@/components/ui/bits";
import { ButtonLink } from "@/components/ui/Button";
import { HeaderTone } from "@/lib/store";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Not found" };
  return {
    title: collection.name,
    description: collection.description,
    openGraph: { images: [collection.cover] },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const pieces = byCollection(collection.slug);
  const others = collections.filter((c) => c.slug !== collection.slug);

  return (
    <>
      <HeaderTone tone="light" />

      {/* hero */}
      <section className="relative h-[82svh] min-h-[520px] overflow-hidden bg-ink">
        <Image
          src={collection.portrait}
          alt={`${collection.name} — campaign image`}
          fill
          priority
          quality={86}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/45" />

        <div className="shell relative flex h-full flex-col justify-end pb-14">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow text-gold-2">
                Collection {collection.year} — {pieces.length} pieces
              </span>
            </div>
          </Reveal>
          <h1 className="display mt-6 text-ivory text-[clamp(3rem,1.6rem+6vw,7rem)]">
            <TextReveal text={collection.name} />
          </h1>
          <Reveal delay={0.15}>
            <Gloss
              arabic={collection.arabic}
              meaning={collection.meaning}
              className="mt-4 text-ivory/50"
            />
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/70">
              {collection.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* story */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-gold-3">Why it exists</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,1.3rem+2.4vw,3rem)]">
                {collection.tagline}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <p className="lede">{collection.story}</p>
              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-ink/10 pt-8">
                <div>
                  <dt className="eyebrow text-ink/40">Introduced</dt>
                  <dd className="display mt-3 text-3xl">{collection.year}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/40">In the collection</dt>
                  <dd className="display mt-3 text-3xl">{pieces.length} pieces</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* editorial break */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden">
        <Parallax distance={70} className="absolute inset-0">
          <div className="relative h-[130%] w-full">
            <Image
              src={collection.still}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
      </section>

      {/* pieces */}
      <section className="bg-ivory py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-[clamp(2rem,1.3rem+3vw,3.75rem)]">
              The {collection.name} pieces
            </h2>
            <p className="text-[13px] opacity-50">
              {pieces.length} pieces — sized and finished to order
            </p>
          </div>
          <ProductGrid pieces={pieces} className="mt-12" />
        </div>
      </section>

      {/* next collections */}
      <section className="border-t border-ink/10 bg-ivory-2 py-16 md:py-20">
        <div className="shell">
          <p className="eyebrow text-gold-3">Continue</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={c.cover}
                    alt={c.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 24vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <p className="display mt-4 text-2xl">{c.name}</p>
                <p className="mt-1 text-[12.5px] opacity-50">{c.tagline}</p>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <ButtonLink href="/shop" variant="outline">
              Shop every piece
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
