import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, collections, collectionName } from "@/lib/data/collections";
import { byCategory, products } from "@/lib/data/products";
import { ProductGrid } from "@/components/collections/ProductGrid";
import { Reveal, TextReveal } from "@/components/ui/motion";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  const count = byCategory(category.slug).length;
  return {
    title: category.name,
    description: `${category.blurb} — ${count} ${count === 1 ? "piece" : "pieces"} at Ritza, Dubai.`,
    openGraph: { images: [category.image] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const pieces = byCategory(category.slug);
  const lines = category.collections;
  const priceFrom = pieces.length ? Math.min(...pieces.map((p) => p.price)) : 0;

  /* Sibling categories, drawn from the lines this one belongs to. */
  const siblings = categories.filter(
    (c) => c.slug !== category.slug && c.collections.some((l) => lines.includes(l)),
  );

  return (
    <div className="pt-[86px] md:pt-[104px]">
      {/* breadcrumb */}
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-5 text-[12px]">
          <Link href="/" className="link-line opacity-45">
            Home
          </Link>
          <span className="opacity-25">/</span>
          <Link href="/shop" className="link-line opacity-45">
            Shop
          </Link>
          <span className="opacity-25">/</span>
          <span className="opacity-70">{category.name}</span>
        </nav>
      </div>

      {/* header */}
      <section className="shell grid gap-10 pb-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold-3/60" />
              <span className="eyebrow text-gold-3">
                {lines.map((l) => collectionName(l)).join(" · ")}
              </span>
            </div>
          </Reveal>
          <h1 className="display mt-6 text-[clamp(2.5rem,1.5rem+4.4vw,5.25rem)]">
            <TextReveal text={category.name} />
          </h1>
          <Reveal delay={0.12}>
            <p className="lede mt-6 max-w-lg">{category.blurb}.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] opacity-60">
              <span>
                {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
              </span>
              {priceFrom > 0 && <span>From {formatPrice(priceFrom)}</span>}
              <TextLink href={`/shop?category=${category.slug}`} className="text-gold-3">
                Filter and sort
              </TextLink>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden bg-sand">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 32vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* grid */}
      <section className="shell pb-16 md:pb-24">
        <h2 className="sr-only">{category.name} pieces</h2>
        {pieces.length === 0 ? (
          <div className="border-y border-ink/10 py-24 text-center">
            <p className="display text-3xl">Nothing in this category yet</p>
            <ButtonLink href="/shop" variant="ink" className="mt-8">
              Browse everything
            </ButtonLink>
          </div>
        ) : (
          <ProductGrid pieces={pieces} />
        )}
      </section>

      {/* sibling categories */}
      {siblings.length > 0 && (
        <section className="border-t border-ink/10 bg-ivory-2 py-14 md:py-20">
          <div className="shell">
            <p className="eyebrow text-gold-3">Keep looking</p>
            <div className="hide-scrollbar mt-8 flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:gap-6 lg:grid-cols-6">
              {siblings.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group w-[150px] shrink-0 md:w-auto"
                >
                  <div className="relative aspect-square overflow-hidden bg-sand">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 150px, 16vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-[13.5px]">{c.name}</p>
                  <p className="mt-0.5 text-[12px] opacity-45">
                    {byCategory(c.slug).length} pieces
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* lines */}
      <section className="py-14 md:py-20">
        <div className="shell grid gap-6 sm:grid-cols-2">
          {collections
            .filter((c) => lines.includes(c.slug))
            .map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                  <Image
                    src={c.cover}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 46vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="display text-ivory text-2xl">{c.name}</p>
                    <p className="mt-1 text-[12.5px] text-ivory/65">{c.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
