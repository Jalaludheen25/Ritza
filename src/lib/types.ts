export type CollectionSlug = "anti-tarnish" | "kerala-traditional";

export type CategorySlug =
  | "cuff-bangles"
  | "chains"
  | "earrings"
  | "anklets"
  | "jumukkas"
  | "nose-pins"
  | "necklace"
  | "chokers"
  | "long-haaram"
  | "ear-cuff"
  | "bugatti"
  | "bangles"
  | "hip-chains";

/** Surface treatment — the axis customers actually filter on. */
export type Finish =
  | "gold-pvd"
  | "rose-gold-pvd"
  | "silver-steel"
  | "antique-gold"
  | "temple-gold"
  | "oxidised-silver";

export type Stone =
  | "None"
  | "Kundan"
  | "Pearl"
  | "Ruby"
  | "Emerald"
  | "Cubic Zirconia"
  | "Turquoise";

export type Badge = "new" | "bestseller" | "limited";
export type TryOnAnchor = "neck" | "ear" | "hand" | "wrist" | "ankle" | "waist" | "nose";

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
  finish: Finish;
  stone: Stone;
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
  arabic?: string;
  tagline: string;
  description: string;
  story: string;
  cover: string;
  portrait: string;
  still: string;
  year: string;
  /** Categories this line is sold in, in navigation order. */
  categories: CategorySlug[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
  collections: CollectionSlug[];
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
