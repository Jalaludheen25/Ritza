import type { Collection, Category } from "@/lib/types";

export const collections: Collection[] = [
  {
    slug: "noor",
    name: "Noor",
    arabic: "نور",
    meaning: "Light",
    tagline: "Diamonds cut for the hour before dusk",
    description:
      "Our house signature. Brilliant and emerald cuts set in a claw so fine it reads as air, so the stone is the only thing you see.",
    story:
      "Noor began with a question our founder asked a cutter in the Gold Souk: how little metal can hold a diamond? The answer took two years. Every Noor setting is hand-raised in 18k white gold, then thinned by hand until the girdle of the stone sits open to the light on all sides. Worn against skin, the piece disappears and the stone stays.",
    cover: "/images/diamond-tennis-necklace.jpg",
    portrait: "/images/diamond-necklace-skin.jpg",
    still: "/images/emerald-cut-pendant.jpg",
    year: "2019",
  },
  {
    slug: "dune",
    name: "Dune",
    meaning: "The desert, in gold",
    tagline: "Sculpted 18k, warmed by the Empty Quarter",
    description:
      "Solid gold with a hand-brushed finish that catches light the way sand does — soft, directional, never mirrored.",
    story:
      "Drive ninety minutes south of the city and the colour changes. Dune is our record of that drive: links pressed into ridged forms, hoops finished with a brush that runs one way only, a signet whose face is left deliberately unpolished. Cast in 18k yellow gold at our Al Quoz atelier and finished by four pairs of hands.",
    cover: "/images/gold-chain-stone.jpg",
    portrait: "/images/gold-chains-rail.jpg",
    still: "/images/gold-hoops-flatlay.jpg",
    year: "2021",
  },
  {
    slug: "lulua",
    name: "Lulua",
    arabic: "لؤلؤة",
    meaning: "Pearl",
    tagline: "A century of Gulf pearling, restated",
    description:
      "South Sea and Akoya pearls, graded by hand and knotted on silk, in settings built for a wardrobe rather than a vitrine.",
    story:
      "Before oil, this coast lived on pearls. Boats left from Al Fahidi in April and returned in September, and the divers who came back rewrote what the Gulf could afford. Lulua is our thank-you note: every strand hand-knotted on silk, every clasp designed to be worn at the front as an ornament in its own right.",
    cover: "/images/pearl-strand-cream.jpg",
    portrait: "/images/pearl-necklace-back.jpg",
    still: "/images/pearls-white-silk.jpg",
    year: "2020",
  },
  {
    slug: "mirage",
    name: "Mirage",
    meaning: "High jewellery",
    tagline: "One of one, or close to it",
    description:
      "Our rarest stones — Colombian emerald, Kashmir-blue sapphire, fancy-cut diamonds — in pieces made in runs of ten or fewer.",
    story:
      "Mirage is where the house stops being a business and starts being a workshop. Stones are bought singly, at auction and from three dealers we have known for a decade. A piece takes between four and eleven months. When a Mirage design sells out it is retired, and the drawings go into the archive.",
    cover: "/images/diamond-necklace-skin2.jpg",
    portrait: "/images/emerald-diamond-necklace.jpg",
    still: "/images/gold-set-dark-plate.jpg",
    year: "2022",
  },
  {
    slug: "vow",
    name: "Vow",
    meaning: "Bridal",
    tagline: "For the sentence you only say once",
    description:
      "Engagement and eternity pieces, sized in-atelier and engraved by hand while you wait.",
    story:
      "Vow is the quietest thing we make. No house motif, no signature stone, nothing to date it — because a ring worn for fifty years should belong to the wearer and not to us. Every band is finished to your size in our Dubai atelier, and hand-engraved inside at no cost, in any script you bring us.",
    cover: "/images/rings-white-boxes.jpg",
    portrait: "/images/rings-white-flowers.jpg",
    still: "/images/wedding-rings.jpg",
    year: "2018",
  },
];

export const categories: Category[] = [
  {
    slug: "necklaces",
    name: "Necklaces",
    blurb: "Rivières, strands and pendants",
    image: "/images/gold-necklace-white.jpg",
  },
  {
    slug: "earrings",
    name: "Earrings",
    blurb: "Hoops, studs and drops",
    image: "/images/gold-hoops-flatlay.jpg",
  },
  {
    slug: "rings",
    name: "Rings",
    blurb: "Solitaires, signets and bands",
    image: "/images/rings-mirror.jpg",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    blurb: "Links, cuffs and strands",
    image: "/images/gold-link-bracelet.jpg",
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
