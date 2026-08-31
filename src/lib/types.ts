export type CategorySlug = "rings" | "earrings" | "necklaces" | "bracelets";
export type CollectionSlug = "noor" | "dune" | "lulua" | "mirage" | "vow";
export type Metal = "yellow-gold" | "white-gold" | "rose-gold" | "platinum";
export type Badge = "new" | "bestseller" | "limited";
export type TryOnAnchor = "neck" | "ear" | "hand" | "wrist";

export type Spec = { label: string; value: string };

export type TryOn = {
  /** Screen-blend plate rendered over the guest's photograph. */
  plate: string;
  anchor: TryOnAnchor;
  /** Starting width of the plate as a share of the photo width. */
  scale: number;
  /** Starting centre of the plate, as a share of the photo box. */
  x: number;
  y: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: CategorySlug;
  collection: CollectionSlug;
  price: number;
  compareAt?: number;
  images: string[];
  description: string;
  detail: string;
  metal: Metal;
  stone: string;
  specs: Spec[];
  badges: Badge[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes?: string[];
  tryOn?: TryOn;
  pairsWith: string[];
};

export type Collection = {
  slug: CollectionSlug;
  name: string;
  meaning: string;
  tagline: string;
  description: string;
  story: string;
  cover: string;
  portrait: string;
  still: string;
  year: string;
  pieces: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
};

export type Review = {
  id: string;
  product: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
};

export type CartLine = {
  slug: string;
  quantity: number;
  size?: string;
  engraving?: string;
};

export type Journal = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
};
