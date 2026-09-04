import type { Collection, Category, CategorySlug, CollectionSlug } from "@/lib/types";

export const collections: Collection[] = [
  {
    slug: "anti-tarnish",
    name: "Ritza Anti-Tarnish",
    meaning: "Wear it in the sea",
    tagline: "Jewellery that survives a Dubai summer",
    description:
      "316L stainless steel under an 18k gold PVD coat. It does not green, does not blacken and does not mind chlorine, perfume or the gym.",
    story:
      "The complaint we heard most often was the same one: it turned my skin green by August. Gulf humidity is brutal on plated brass, and most fashion jewellery is plated brass. So we stopped plating. Every Anti-Tarnish piece is solid 316L surgical steel with an 18k gold PVD bond — the same process used on watch cases — which is measured in microns rather than in wishes. Swim in it, shower in it, sweat in it. It comes back the same colour.",
    cover: "/images/at-chain-layered-model.jpg",
    portrait: "/images/at-chain-highneck.jpg",
    still: "/images/at-hoop-studio.jpg",
    year: "2023",
    categories: ["cuff-bangles", "chains", "earrings", "anklets"],
  },
  {
    slug: "kerala-traditional",
    name: "Kerala Traditional",
    meaning: "കേരളം — the old forms",
    arabic: "കേരളം",
    tagline: "Temple jewellery, made the long way",
    description:
      "Kasu mala, nagapadam, palakka and jumukka — cast, chased and stone-set by hand in the patterns Kerala goldsmiths have worked for three centuries.",
    story:
      "Kerala jewellery is not decoration, it is grammar. A kasu mala counts coins; a nagapadam repeats the serpent hood; palakka sets green stone into gold leaf. Get the proportion wrong and every grandmother in the room knows. We work with two families of goldsmiths in Thrissur who still cut their own dies, and we ship to Dubai because that is where the diaspora is — the same pieces, the same weights, without a flight home to buy them.",
    cover: "/images/kt-necklace-jasmine.jpg",
    portrait: "/images/kt-bride-kasavu.jpg",
    still: "/images/kt-jhumka-stand.jpg",
    year: "2019",
    categories: [
      "earrings",
      "jumukkas",
      "nose-pins",
      "necklace",
      "chokers",
      "long-haaram",
      "ear-cuff",
      "bugatti",
      "bangles",
      "hip-chains",
      "anklets",
    ],
  },
];

export const categories: Category[] = [
  {
    slug: "cuff-bangles",
    name: "Cuff Bangles",
    blurb: "Open cuffs and stacking bands",
    image: "/images/at-cuff-sculpt.jpg",
    collections: ["anti-tarnish"],
  },
  {
    slug: "chains",
    name: "Chains",
    blurb: "Fine, layered and pendant chains",
    image: "/images/at-chain-silk.jpg",
    collections: ["anti-tarnish"],
  },
  {
    slug: "earrings",
    name: "Earrings",
    blurb: "Hoops, studs and temple drops",
    image: "/images/at-hoop-studio.jpg",
    collections: ["anti-tarnish", "kerala-traditional"],
  },
  {
    slug: "anklets",
    name: "Anklets",
    blurb: "Everyday chains and kolusu",
    image: "/images/kt-anklet-pair.jpg",
    collections: ["anti-tarnish", "kerala-traditional"],
  },
  {
    slug: "jumukkas",
    name: "Jumukkas",
    blurb: "The bell drop, in every weight",
    image: "/images/kt-jhumka-stand.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "nose-pins",
    name: "Nose Pins",
    blurb: "Mookuthi and bridal nath",
    image: "/images/kt-nosepin-close.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "necklace",
    name: "Necklace",
    blurb: "Kasu mala and temple work",
    image: "/images/kt-necklace-pot.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "chokers",
    name: "Chokers",
    blurb: "Attiyal worn at the throat",
    image: "/images/kt-choker-gold.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "long-haaram",
    name: "Long Haaram",
    blurb: "Waist-length ceremonial chains",
    image: "/images/kt-haaram-bust.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "ear-cuff",
    name: "Ear Cuff",
    blurb: "Clipped to the helix, no piercing",
    image: "/images/at-earcuff-hand.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "bugatti",
    name: "Bugatti",
    blurb: "The pierced upper-ear ornament",
    image: "/images/at-hoop-ear.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "bangles",
    name: "Bangles",
    blurb: "Kada, palakka and stacks",
    image: "/images/kt-bangle-ornate.jpg",
    collections: ["kerala-traditional"],
  },
  {
    slug: "hip-chains",
    name: "Hip Chains",
    blurb: "Oddiyanam and aranjanam",
    image: "/images/at-chain-coiled.jpg",
    collections: ["kerala-traditional"],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

/** Categories belonging to one line, in the order that line lists them. */
export const categoriesFor = (collection: CollectionSlug) => {
  const line = getCollection(collection);
  if (!line) return [];
  return line.categories
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter(Boolean) as Category[];
};

export const categoryName = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const collectionName = (slug: CollectionSlug) =>
  collections.find((c) => c.slug === slug)?.name ?? slug;
