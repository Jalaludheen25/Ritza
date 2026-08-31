import type { Journal } from "@/lib/types";

export const site = {
  name: "Ritza",
  legalName: "Ritza Fine Jewellery LLC",
  tagline: "Fine jewellery, made in Dubai",
  description:
    "Ritza is a Dubai jewellery house working in 18k gold, certified diamonds and Gulf pearls. Every piece is finished by hand in our Al Quoz atelier.",
  address: {
    line1: "Unit 14, Alserkal Avenue",
    line2: "Al Quoz 1, Dubai",
    country: "United Arab Emirates",
  },
  atelier: {
    line1: "Warehouse 8, Al Quoz Industrial 3",
    line2: "Dubai, United Arab Emirates",
  },
  phone: "+971 4 385 0120",
  whatsapp: "+971 50 385 0120",
  email: "atelier@ritza.ae",
  hours: [
    { days: "Saturday – Thursday", time: "10:00 – 20:00" },
    { days: "Friday", time: "14:00 – 21:00" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
};

export const services = [
  {
    title: "Complimentary sizing",
    body: "Every ring is finished to your measurement in the atelier before it ships. Resizing stays free for life.",
  },
  {
    title: "Hand engraving",
    body: "A letter, a date, a coordinate — cut by hand inside the band. Allow four working days.",
  },
  {
    title: "Insured worldwide delivery",
    body: "Fully insured, signature on delivery. Complimentary across the GCC, two to five working days.",
  },
  {
    title: "Lifetime care",
    body: "Cleaning, polishing, rhodium and pearl restringing, free for as long as the piece is yours.",
  },
];

export const journal: Journal[] = [
  {
    slug: "the-pearl-coast",
    title: "The pearl coast, before the towers",
    excerpt:
      "For two centuries this shoreline ran on pearls. We went looking for the last people who remember the boats leaving in April.",
    category: "Heritage",
    readTime: "8 min",
    date: "April 2025",
    image: "/images/pearls-table.jpg",
  },
  {
    slug: "how-to-read-a-diamond",
    title: "How to read a diamond without a loupe",
    excerpt:
      "Colour, clarity, cut, carat — and the fifth thing nobody writes on the certificate. A working guide from our head setter.",
    category: "Craft",
    readTime: "6 min",
    date: "March 2025",
    image: "/images/diamond-set-terracotta.jpg",
  },
  {
    slug: "eleven-months-of-mirage",
    title: "Eleven months inside one pair of earrings",
    excerpt:
      "From a drawing on tracing paper to 148 set stones. The full record of a single Mirage commission.",
    category: "Atelier",
    readTime: "11 min",
    date: "February 2025",
    image: "/images/gold-jewels-plate-2.jpg",
  },
];

export const pressQuotes = [
  { quote: "The most interesting jewellery house to open in the Gulf in a decade.", source: "Vogue Arabia" },
  { quote: "Restraint, executed at a level that is genuinely rare.", source: "Wallpaper*" },
  { quote: "Ritza has made hand-finishing a selling point again.", source: "The National" },
  { quote: "A Dubai atelier with the patience of a Geneva one.", source: "Robb Report" },
];

export const faqs = [
  {
    q: "How long does an order take?",
    a: "Pieces held in the atelier ship within two working days. Anything sized, engraved or made to order takes seven to twelve working days, and Mirage commissions are quoted individually.",
  },
  {
    q: "Can I return a piece?",
    a: "Thirty days from delivery, unworn and in its original box, for a full refund. Engraved and made-to-order pieces are excluded, which we confirm in writing before we start.",
  },
  {
    q: "Do you ship outside the UAE?",
    a: "Yes — fully insured, worldwide, with signature on delivery. Duties and taxes outside the GCC are the responsibility of the recipient.",
  },
  {
    q: "Are your diamonds certified?",
    a: "Every centre stone above 0.30ct ships with its GIA report. Melee is sourced through the Kimberley Process and audited annually.",
  },
  {
    q: "Can I book an appointment?",
    a: "Yes. The Alserkal Avenue salon runs by appointment from Saturday to Thursday, and we hold a private room for bridal consultations.",
  },
  {
    q: "How does the Try-On work?",
    a: "You upload a photograph, and we render the piece onto it at true scale so you can judge proportion before you buy. Nothing is stored — the image never leaves your device.",
  },
];
