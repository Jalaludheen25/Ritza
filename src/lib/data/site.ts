import type { Journal } from "@/lib/types";

export const site = {
  name: "Ritza",
  legalName: "Ritza Jewellery Trading LLC",
  tagline: "Anti-tarnish and Kerala traditional, in Dubai",
  description:
    "Two lines from one Dubai workshop — 316L anti-tarnish steel you can swim in, and Kerala temple jewellery made the long way.",
  address: {
    line1: "Shop 12, Meena Bazaar",
    line2: "Bur Dubai, Dubai",
    country: "United Arab Emirates",
  },
  atelier: {
    line1: "Studio 4, Al Quoz Industrial 3",
    line2: "Dubai, United Arab Emirates",
  },
  phone: "+971 4 359 8820",
  whatsapp: "+971 50 359 8820",
  email: "hello@ritza.ae",
  hours: [
    { days: "Saturday – Thursday", time: "10:00 – 22:00" },
    { days: "Friday", time: "14:00 – 22:00" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
};

export const services = [
  {
    title: "Two-year anti-tarnish promise",
    body: "If an Anti-Tarnish piece fades, discolours or marks your skin within two years, we replace it. No receipt hunting — the order is on your account.",
  },
  {
    title: "Free delivery over AED 200",
    body: "Same-day across Dubai on orders before 2pm, next day to the rest of the UAE, two to five days across the GCC.",
  },
  {
    title: "Sizing and restringing",
    body: "Bangles sized, haaram shortened, kolusu restrung. Free for life on anything bought here.",
  },
  {
    title: "Thirty-day returns",
    body: "Unworn and in its box, for any reason. Pierced nose pins and ear studs are excluded for hygiene.",
  },
];

export const journal: Journal[] = [
  {
    slug: "why-your-gold-turns-green",
    title: "Why your gold turned green in August",
    excerpt:
      "Gulf humidity, plated brass and the two microns that decide whether a chain survives a summer. A plain explanation of PVD.",
    category: "Materials",
    readTime: "6 min",
    date: "May 2026",
    image: "/images/at-chain-layered-silk.jpg",
  },
  {
    slug: "reading-a-kasu-mala",
    title: "How to read a kasu mala",
    excerpt:
      "Coin count, graduation and overlap — the three things a Kerala grandmother checks before she says anything nice about your necklace.",
    category: "Tradition",
    readTime: "8 min",
    date: "April 2026",
    image: "/images/kt-necklace-pot.jpg",
  },
  {
    slug: "the-nagapadam-hood",
    title: "Nine hoods, one hand",
    excerpt:
      "Inside a Thrissur workshop where the nagapadam dies are still cut by hand, and every hood has to match the one before it.",
    category: "Workshop",
    readTime: "11 min",
    date: "March 2026",
    image: "/images/kt-haaram-bust.jpg",
  },
];

export const pressQuotes = [
  { quote: "The anti-tarnish line does what every mall brand promises and none deliver.", source: "Time Out Dubai" },
  { quote: "Kerala temple work of a standard you normally have to fly for.", source: "Gulf News" },
  { quote: "Ritza has quietly become the default for the Malayali community here.", source: "Khaleej Times" },
  { quote: "Steel jewellery that does not look like steel jewellery.", source: "Emirates Woman" },
];

export const faqs = [
  {
    q: "What does anti-tarnish actually mean?",
    a: "Every Anti-Tarnish piece is solid 316L surgical stainless steel with an 18k gold PVD bond of at least 2.5 microns. PVD is a vacuum process that fuses the colour into the surface rather than sitting on top of it, which is why it does not flake, fade or react with skin. You can swim, shower, sweat and sleep in it.",
  },
  {
    q: "Is the Kerala Traditional line real gold?",
    a: "No, and we will never imply otherwise. It is gold-plated brass over a hand-cast body, in the temple and antique finishes traditional to Kerala work. That is what lets a nagapadam haaram cost AED 2,950 instead of AED 90,000. The craft — casting, chasing, kundan setting — is the same.",
  },
  {
    q: "How do I care for the traditional pieces?",
    a: "Keep them dry and away from perfume. Put jewellery on last and take it off first. Wipe with the dry cloth in the box after wearing, and store in the pouch rather than loose in a drawer. Treated this way, plating on temple work lasts years.",
  },
  {
    q: "How long does delivery take?",
    a: "Same-day within Dubai for orders placed before 2pm, next working day elsewhere in the UAE, and two to five working days across the GCC. Free over AED 200; AED 20 below that.",
  },
  {
    q: "Can I return something?",
    a: "Thirty days from delivery, unworn and in its original packaging, for a full refund. Pierced items — nose pins, studs and the bugatti fittings — cannot be returned once the seal is broken, for hygiene reasons.",
  },
  {
    q: "Do you size bangles?",
    a: "Yes. Kada and bangles come in 2.4, 2.6 and 2.8 inch inner diameters. If you are between sizes, message us on WhatsApp with a wrist measurement and we will tell you which to take. Sizing adjustments are free for life.",
  },
  {
    q: "How does the Virtual Try-On work?",
    a: "You upload a photograph and we render the piece onto it at true scale so you can judge proportion before buying. It runs entirely in your browser — the photograph is never uploaded, never stored and never seen by us.",
  },
  {
    q: "Do you make custom pieces?",
    a: "For the Kerala Traditional line, yes — send a drawing or a photograph of a family piece and we will quote. Expect eight to fourteen weeks. The Anti-Tarnish line is not made to order.",
  },
];

export const shippingPolicy = [
  {
    title: "Delivery within the UAE",
    body: "Orders placed before 2pm are dispatched the same working day. Dubai deliveries arrive the same evening; the rest of the UAE arrives the next working day. Delivery is free on orders over AED 200 and AED 20 below that. Every parcel ships with tracking and requires a signature.",
  },
  {
    title: "GCC and international",
    body: "Saudi Arabia, Oman, Kuwait, Bahrain and Qatar take two to five working days. Elsewhere is five to twelve working days by insured courier. Duties and import taxes outside the GCC are payable by the recipient — we cannot calculate these at checkout.",
  },
  {
    title: "Made-to-order and custom",
    body: "Custom Kerala Traditional commissions take eight to fourteen weeks from approved drawing. We photograph the piece at three stages and send them to you. The delivery estimate above starts once the piece is finished.",
  },
  {
    title: "Returns",
    body: "Thirty days from delivery. The piece must be unworn, in its original box and pouch, with the tag attached. Message us on WhatsApp or email and we will send a collection label. Refunds are issued to the original payment method within five working days of the piece reaching us.",
  },
  {
    title: "What cannot be returned",
    body: "Pierced jewellery — nose pins, ear studs and bugatti fittings — cannot be returned once the hygiene seal is broken. Custom commissions and pieces altered to your measurements are also excluded. We confirm this in writing before starting any custom work.",
  },
  {
    title: "Faults and the anti-tarnish promise",
    body: "If an Anti-Tarnish piece fades, discolours or marks your skin within two years of purchase, we replace it once, free. This is separate from your statutory rights and does not cover physical damage, scratching or loss.",
  },
];

export const privacyPolicy = [
  {
    title: "What we collect",
    body: "Your name, email, delivery address and telephone number when you place an order; your email alone if you only subscribe to the letter. We record which pages you visit and what you put in your bag, so the site can keep a cart between visits.",
  },
  {
    title: "Virtual Try-On photographs",
    body: "Photographs used in the Virtual Try-On are never uploaded. The rendering happens inside your browser and the image is discarded from memory the moment you close the window. We do not receive it, store it, or use it to train anything.",
  },
  {
    title: "Payment details",
    body: "Card details are entered directly into our payment processor and never reach our servers. We store only the last four digits and the card type, so you can recognise an order in your history.",
  },
  {
    title: "Who else sees it",
    body: "Our courier receives your name, address and telephone number in order to deliver. Our payment processor receives what it needs to take payment. Nobody else. We do not sell, rent or share customer data, and we do not run third-party advertising trackers.",
  },
  {
    title: "Cookies",
    body: "Strictly necessary cookies keep you signed in and remember your bag. Analytics cookies count visits in aggregate and can be declined without breaking anything. There are no advertising cookies on this site.",
  },
  {
    title: "Your rights",
    body: "Ask us for a copy of everything we hold on you, ask us to correct it, or ask us to delete it — email hello@ritza.ae and we will act within thirty days. Deleting your account removes your order history, which we cannot then recover for warranty claims.",
  },
];

export const termsPolicy = [
  {
    title: "These terms",
    body: "Buying from ritza.ae means accepting what follows. They are governed by the laws of the United Arab Emirates, and the courts of Dubai have jurisdiction over any dispute.",
  },
  {
    title: "Orders",
    body: "An order is an offer to buy. The contract forms when we send the dispatch confirmation, not at checkout. We may decline an order if a piece is out of stock, if the price was listed in error, or if we cannot deliver to the address given.",
  },
  {
    title: "Prices",
    body: "All prices are in UAE dirhams and include VAT at 5%. Delivery is shown separately at checkout. We may change prices at any time, but never after you have received a dispatch confirmation.",
  },
  {
    title: "Descriptions and materials",
    body: "Anti-Tarnish pieces are 316L stainless steel with 18k gold PVD. Kerala Traditional pieces are gold-plated brass, hand-cast and hand-finished; they are not solid gold and are not sold as an investment. Stones described as ruby, emerald or turquoise are synthetic or treated unless a piece states otherwise. Screens vary — colour in person may differ slightly.",
  },
  {
    title: "Warranty",
    body: "The two-year anti-tarnish promise covers fading, discolouration and skin marking on the Anti-Tarnish line. Kerala Traditional plating carries a six-month warranty against flaking under normal wear. Neither covers scratching, impact damage, loss, or wear caused by perfume, chlorine or cleaning chemicals.",
  },
  {
    title: "Intellectual property",
    body: "The Ritza name, mark and photography belong to Ritza Jewellery Trading LLC. Traditional Kerala motifs — nagapadam, palakka, kasu, mullamottu — are common heritage and we claim no ownership of them.",
  },
];

/** Illustrative account data — replaced by the API at integration. */
export const demoOrders = [
  {
    ref: "RZ-482190",
    date: "2 May 2026",
    status: "Delivered" as const,
    total: 1030,
    items: [
      { slug: "malabar-jumukka", qty: 1 },
      { slug: "aria-fine-chain", qty: 2 },
    ],
  },
  {
    ref: "RZ-471044",
    date: "14 March 2026",
    status: "In the workshop" as const,
    total: 2480,
    items: [{ slug: "kundan-bridal-choker", qty: 1 }],
  },
  {
    ref: "RZ-460318",
    date: "8 January 2026",
    status: "Delivered" as const,
    total: 500,
    items: [
      { slug: "halo-everyday-hoops", qty: 1 },
      { slug: "vega-sculpted-cuff", qty: 1 },
    ],
  },
];
