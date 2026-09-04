import type { Review } from "@/lib/types";

/* Written against the catalogue slugs. Compact tuple authoring:
   [product, name, location, rating, title, body, date] */

type Row = [string, string, string, number, string, string, string];

const rows: Row[] = [
  ["vega-sculpted-cuff", "Mariam K.", "Dubai", 5, "Two summers, still gold",
    "Bought it before last Ramadan and it has been in the sea, the pool and the gym since. Not a mark on it, and no green wrist.", "14 April 2026"],
  ["vega-sculpted-cuff", "Priya N.", "Sharjah", 5, "Slides on properly",
    "Most cuffs this wide will not go over my wrist bone. The taper at the opening is the whole trick.", "2 March 2026"],
  ["vega-sculpted-cuff", "Hana R.", "Abu Dhabi", 4, "Heavier than I expected",
    "Not a complaint — it feels like something. Just do not order it thinking it is a delicate piece.", "19 January 2026"],

  ["aria-fine-chain", "Layla A.", "Dubai", 5, "I have not taken it off since March",
    "Showered, swam, slept in it. Still exactly the colour it was in the box. I bought two more as gifts.", "28 May 2026"],
  ["aria-fine-chain", "Sneha T.", "Dubai", 5, "Layers without tangling",
    "Fine enough to sit under the Sol coin set without fighting it. The extender is genuinely useful.", "11 April 2026"],
  ["aria-fine-chain", "Fatima B.", "Doha", 5, "The clasp is small and strong",
    "My last chain from a mall shop broke at the clasp in six weeks. This one has held through a whole summer.", "3 March 2026"],
  ["aria-fine-chain", "Reena M.", "Dubai", 4, "Wish it came in 50cm",
    "45 is right for me but my sister wanted longer. Otherwise faultless for the price.", "22 January 2026"],

  ["halo-everyday-hoops", "Aisha B.", "Dubai", 5, "They hang straight",
    "Every hollow hoop I own tips forward by lunchtime. These stay where you put them all day.", "30 April 2026"],
  ["halo-everyday-hoops", "Elena M.", "Dubai", 5, "Bought a second pair",
    "Wore the first pair daily for eight months. No fading at the hinge, which is where plating usually goes first.", "16 March 2026"],
  ["halo-everyday-hoops", "Divya S.", "Ajman", 5, "Perfect size",
    "20mm is the one that goes with everything. Big enough to see, small enough for work.", "7 February 2026"],

  ["sol-coin-layer-set", "Nadia H.", "Dubai", 5, "One clasp solves everything",
    "I gave up on layering because of the knots. This has been on for three months without a single tangle.", "21 May 2026"],
  ["sol-coin-layer-set", "Anjali R.", "Dubai", 4, "Coin is smaller than it looks",
    "16mm reads delicate rather than statement. I like it, but check the measurement before ordering.", "9 March 2026"],

  ["sole-everyday-anklet", "Sara T.", "Dubai", 5, "Survived Kite Beach",
    "Salt water, sand, factor fifty. Came home the same colour it left. That is all I wanted.", "18 May 2026"],
  ["sole-everyday-anklet", "Yasmin A.", "Dubai", 5, "Does not catch on sandals",
    "The length is judged well — it sits below the ankle bone and stays out of the strap.", "2 April 2026"],

  ["thread-stacking-cuffs", "Grace O.", "Dubai", 5, "Three for the price of two",
    "Wear all three on one wrist. They do not ride up over each other, which is the thing I was worried about.", "26 April 2026"],

  ["cortez-chain-cuff", "Omar Z.", "Dubai", 5, "The clasp is invisible",
    "Nobody can find where it opens. Feels like a solid loop of gold and weighs like one too.", "12 March 2026"],

  ["torsade-twist-hoops", "Beatriz C.", "Dubai", 5, "The twist catches light properly",
    "Plain hoops go flat in photographs. These do not. Worth the extra forty dirhams over the Halo.", "1 April 2026"],

  ["petit-huggie-hoops", "Tara S.", "Dubai", 5, "In my second hole since January",
    "Have not taken them out once. No irritation, no discolouration, and I sleep in them.", "14 May 2026"],

  ["bleu-stone-layer", "Ines P.", "Dubai", 4, "Lovely stone, short chain",
    "The spinel is a genuinely good blue. 42cm sits high on me — I would have liked an extender.", "8 February 2026"],

  ["malabar-jumukka", "Deepa Menon", "Dubai", 5, "My mother approved, which never happens",
    "She checked the dome and the bead rim before she said anything. Then she asked where the shop was.", "3 June 2026"],
  ["malabar-jumukka", "Anitha K.", "Dubai", 5, "They actually ring",
    "Cast jumukkas are silent. These have the sound I remember from home, which I did not expect from a plated piece.", "22 April 2026"],
  ["malabar-jumukka", "Revathi S.", "Abu Dhabi", 5, "The support chain saves your ears",
    "26g is a lot to hang off a lobe. Hooked the chain into my hair and forgot about them for six hours.", "15 March 2026"],
  ["malabar-jumukka", "Sruthi P.", "Dubai", 4, "Bigger than the photo suggests",
    "34mm is substantial. I love them but they are not an everyday earring.", "28 January 2026"],

  ["kasu-mala-necklace", "Lakshmi Nair", "Dubai", 5, "The overlap is right",
    "This is the detail everyone gets wrong. The coins sit over each other exactly as they should and it lies flat on the collarbone.", "29 May 2026"],
  ["kasu-mala-necklace", "Gita R.", "Dubai", 5, "Wore it to an onam sadhya",
    "Three people asked which shop in Thrissur. I said Dubai and nobody believed me.", "12 April 2026"],
  ["kasu-mala-necklace", "Meera J.", "Sharjah", 5, "Weight feels honest",
    "68g for a plated piece is generous. It hangs like the real thing rather than sitting up on the neck.", "6 March 2026"],

  ["attiyal-gold-choker", "Reem Q.", "Dubai", 5, "Sits exactly at the throat",
    "The dori means it fits properly rather than nearly. Layered over the kasu mala it is the whole look.", "20 May 2026"],
  ["attiyal-gold-choker", "Nisha V.", "Dubai", 4, "Dori takes practice",
    "Tying it behind your own neck the first time is a two-person job. After that it is fine.", "2 March 2026"],

  ["kundan-bridal-choker", "Aparna S.", "Dubai", 5, "Worth the eleven weeks",
    "Five rows and every stone sits level. I have seen pieces at four times this that do not.", "1 June 2026"],
  ["kundan-bridal-choker", "Haritha M.", "Dubai", 5, "The photographs came back well",
    "Kundan can look flat under a flash. This did not — the stepped rows catch light at different angles.", "17 April 2026"],

  ["nagapadam-long-haaram", "Suja T.", "Dubai", 5, "Every hood matches",
    "Nine of them and you cannot tell one from the next. That is the whole test for nagapadam.", "24 May 2026"],

  ["mullamottu-haaram", "Priya Varma", "Dubai", 5, "Light enough to keep on",
    "The nagapadam was too heavy for a full evening. This one I wore from four until midnight.", "9 April 2026"],

  ["lakshmi-temple-necklace", "Kavitha R.", "Dubai", 5, "The chasing is real",
    "You can see the graver marks in the hair and the lotus. Cast-only pieces are smooth and dead by comparison.", "13 May 2026"],

  ["kundan-petal-earrings", "Zainab F.", "Dubai", 5, "Pearl fringe moves properly",
    "Hangs and swings rather than sitting stiff. The kundan is set flush, no glue lines anywhere.", "18 April 2026"],
  ["kundan-petal-earrings", "Shalini D.", "Dubai", 5, "Goes with cotton and silk both",
    "I expected them to be too much for a work saree. They are not.", "27 February 2026"],

  ["palakka-ornate-bangle", "Ammu K.", "Dubai", 5, "The green sits proud",
    "That half-millimetre they talk about is real — the stones catch as your wrist turns. Beautiful thing.", "5 May 2026"],
  ["palakka-ornate-bangle", "Sandhya P.", "Dubai", 4, "Order a size up",
    "2.6 was tight over my hand. The hinge helps but I would take 2.8 again.", "21 March 2026"],

  ["emerald-kada-pair", "Bindu S.", "Abu Dhabi", 5, "Sold as a pair, correctly",
    "Everywhere else sells these singly and it always looks wrong. Thank you for not doing that.", "11 April 2026"],

  ["kerala-bangle-stack", "Nimmy A.", "Dubai", 5, "Six is the right number",
    "Fills the wrist without the noise. I wear them stacked over the palakka for weddings.", "29 March 2026"],

  ["mookuthi-floral-nose-pin", "Athira R.", "Dubai", 5, "Screw fit, finally",
    "I have lost three push-fit mookuthi. This one has not moved in four months.", "16 May 2026"],
  ["mookuthi-floral-nose-pin", "Jyothi M.", "Dubai", 5, "Small and correct",
    "7mm is the traditional size. Anything bigger stops looking like a mookuthi.", "3 March 2026"],

  ["nath-bridal-nose-ring", "Devika N.", "Dubai", 5, "The hair chain takes the weight",
    "Wore it for six hours of ceremony without my nose aching once.", "25 April 2026"],

  ["oxidised-silver-jumukka", "Ancy T.", "Dubai", 5, "The oxidising is in the recesses",
    "Cheap oxidised silver is just painted black. On these the highlights are polished back properly.", "8 May 2026"],

  ["kolusu-silver-anklet", "Remya S.", "Dubai", 5, "Silver below the waist",
    "Glad you kept the rule. Gold anklets always look wrong to me and nobody stocks proper silver kolusu here.", "19 April 2026"],
  ["kolusu-silver-anklet", "Divya Menon", "Dubai", 5, "Sound is right",
    "Soft, not jangly. My daughter asked for a pair the day she saw them.", "1 March 2026"],

  ["payal-bell-anklet", "Manju K.", "Dubai", 5, "Bells are cast, not stamped",
    "You can hear the difference. My old stamped pair went silent within a year.", "12 April 2026"],

  ["oddiyanam-hip-chain", "Anjana P.", "Dubai", 5, "It follows the body",
    "The hinged sections mean no gap at the back when you sit down. This is why it costs what it costs.", "30 May 2026"],

  ["aranjanam-waist-chain", "Sruthy V.", "Dubai", 5, "Mine finally fits again",
    "Had one from childhood that stopped fitting at fifteen. Ordered the 84 and it is exactly right.", "7 April 2026"],

  ["thali-ear-cuff", "Nazrin A.", "Dubai", 4, "Spring is soft, as promised",
    "Held through a full wedding. Came off without pinching, which the last one I bought did not.", "23 March 2026"],

  ["bugatti-helix-ornament", "Faseela M.", "Dubai", 5, "Correct gauge",
    "1.0mm is what a healed helix takes. Most sellers ship 1.2 and it does not go in.", "14 May 2026"],

  ["turquoise-kundan-set", "Rashmi B.", "Dubai", 5, "Set stays a set",
    "Bought as necklace plus earrings for one price. The turquoise is unusual and I get asked about it constantly.", "26 April 2026"],

  ["nila-temple-studs", "Soumya R.", "Dubai", 5, "Everyday temple wear",
    "Light, small and the Lakshmi relief is sharp. These live in my ears Monday to Friday.", "9 March 2026"],

  ["thanka-drop-earrings", "Veena K.", "Dubai", 5, "Three tiers actually move",
    "They keep swinging after you turn your head. Nothing else I own does that.", "17 April 2026"],

  ["ruby-drop-jumukka", "Arya S.", "Dubai", 5, "Bridal weight, bridal look",
    "62mm is a commitment and it photographed beautifully. The hair chain is essential, not optional.", "2 June 2026"],

  ["marisol-charm-chain", "Hiba N.", "Dubai", 4, "The blank ring is a nice touch",
    "Added a charm from my grandmother's bracelet. Rings open cleanly without pliers.", "5 April 2026"],

  ["rivea-textured-hoops", "Laila K.", "Dubai", 5, "Flutes are cut, you can feel them",
    "Stamped texture wears flat. These have a real edge to each groove.", "28 March 2026"],

  ["lumen-band-cuff", "Noura S.", "Dubai", 5, "Screw closure, no anxiety",
    "I swim every morning. Not once has it come loose.", "11 May 2026"],

  ["rivi-chain-anklet", "Maya T.", "Dubai", 5, "Flat links do not spin",
    "My old round-link anklet ended up inside my shoe daily. This one lies flat and stays put.", "21 April 2026"],

  ["meridian-layered-anklet", "Salma I.", "Dubai", 4, "Pretty, slightly long",
    "Sits a touch lower than I like on a small ankle, but the extender covers it.", "6 March 2026"],

  ["amara-heart-pendant", "Roshni P.", "Dubai", 5, "It does not spin",
    "Every flat pendant I own turns edge-on. This one faces forward all day, which is apparently deliberate.", "18 May 2026"],

  ["bugatti-twin-hoop", "Ayesha M.", "Dubai", 5, "One hole, two rings",
    "Exactly what I wanted and no second piercing to heal.", "2 April 2026"],

  ["vine-climber-ear-cuff", "Nithya G.", "Dubai", 4, "Specify your ear",
    "I nearly ordered the wrong side. The checkout does ask, so read it.", "24 February 2026"],
];

export const reviews: Review[] = rows.map(([product, name, location, rating, title, body, date], i) => ({
  id: `rv-${String(i + 1).padStart(2, "0")}`,
  product,
  name,
  location,
  rating,
  title,
  body,
  date,
  verified: true,
}));

export const reviewsFor = (slug: string) => reviews.filter((r) => r.product === slug);

export const ratingBreakdown = (slug: string) => {
  const list = reviewsFor(slug);
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => r.rating === star).length,
  }));
  return { total: list.length, counts };
};
