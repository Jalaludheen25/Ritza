import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { products, getProduct, getProducts, byCollection } from "@/lib/data/products";
import { getCollection } from "@/lib/data/collections";
import { Gallery } from "@/components/product/Gallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Reviews } from "@/components/product/Reviews";
import {
  CompleteYourLook,
  RelatedProducts,
  RecentlyViewed,
} from "@/components/product/ProductStrip";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: `${product.description} ${formatPrice(product.price)}.`,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const collection = getCollection(product.collection)!;
  const pairs = getProducts(product.pairsWith).slice(0, 3);
  const related = byCollection(product.collection)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

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
          <Link href={`/shop?category=${product.category}`} className="link-line opacity-45">
            {product.category[0].toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="opacity-25">/</span>
          <span className="opacity-70">{product.name}</span>
        </nav>
      </div>

      {/* gallery + info */}
      <div className="shell pb-16 md:pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <Gallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5">
            <Suspense fallback={<div className="h-[600px]" />}>
              <ProductInfo product={product} />
            </Suspense>
          </div>
        </div>
      </div>

      {pairs.length > 0 && <CompleteYourLook pieces={pairs} hero={product} />}

      <Reviews product={product} />

      <RelatedProducts
        pieces={related}
        collectionName={collection.name}
        collectionSlug={collection.slug}
      />

      <RecentlyViewed exclude={product.slug} />
    </div>
  );
}
