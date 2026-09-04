# Ritza — anti-tarnish & Kerala traditional jewellery, Dubai

A front-end prototype for a Dubai jewellery retailer with two product lines, built for client
review. Sixteen page types, a forty-two piece catalogue across thirteen categories, a working bag
and checkout, and a front-end demonstration of the Virtual Try-On.

Everything runs on mock data in the browser. There is no backend, no database, no payment
processor and no AI service.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run start      # serve the production build
```

Node 20+ is required. The build prerenders 76 routes, including every product, category and line page.

---

## The brand

The supplied mark (`assets/Ritza Profile Picture.jpg.jpeg`) is used throughout — it is never
re-set in type. `scripts/build-logo.mjs` reads the original artwork, samples the palette from it,
knocks out the cream ground into transparency (un-premultiplying the edges so they stay clean on
any colour), and writes six lock-ups plus the favicon:

```
public/brand/ritza-lockup.png          monogram + wordmark, navy
public/brand/ritza-lockup-light.png    …ivory, for dark grounds
public/brand/ritza-wordmark.png        wordmark only
public/brand/ritza-wordmark-light.png
public/brand/ritza-monogram.png        the "ra" mark
public/brand/ritza-monogram-light.png
src/app/icon.png                       favicon — monogram on brand navy
```

The mark appears in the header, the mobile navigation, the footer (twice — once at reading size,
once oversized as a graphic), the loading screen, the try-on view, the checkout confirmation and
the 404.

### Palette

Sampled directly from the logo file rather than guessed at:

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#0b1b38` | the navy of the wordmark — type, dark sections |
| `ivory` / `ivory-2` | `#f8f4ee` / `#f2ebe1` | the cream ground of the logo |
| `sand` | `#e8dccd` | third surface, image placeholders |
| `gold` | `#c9aa6a` | the diamond accents in the mark — rules, accents, active states |

### Typography

- **Cormorant Garamond** (300–600, italics) — display. High contrast, close in feel to the
  wordmark's serif.
- **Jost** (200–500) — everything else, and the small tracked caps (`.eyebrow`) that hold the
  layout together.

Both load through `next/font`. Arabic collection glosses use a `.arabic` utility that removes
tracking and uppercasing, since neither works on a connected script.

---

## Product lines

| Line | Categories |
| --- | --- |
| **Ritza Anti-Tarnish** | Cuff Bangles, Chains, Earrings, Anklets |
| **Kerala Traditional** | Earrings, Jumukkas, Nose Pins, Necklace, Chokers, Long Haaram, Ear Cuff, Bugatti, Bangles, Hip Chains, Anklets |

Category and line are separate axes, so Earrings and Anklets belong to both lines without being
duplicated. Thirteen unique categories, forty-two pieces, prices in AED.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero, featured line, new arrivals rail, categories, best sellers, brand story, complete-the-look, Try-On showcase, services, newsletter |
| `/shop` | Line switcher, category chips, and filters for collection, finish, stone, price and edits, with search and five sorts. Filters sync to the URL |
| `/category/[slug]` | Dedicated page per category — header, grid, sibling categories, parent lines |
| `/collections` | Index of the two lines |
| `/collections/[slug]` | Line hero, story, parallax break, pieces, onward links |
| `/product/[slug]` | Zoomable gallery, specification, try-on, complete-your-look, reviews, scored recommendations, recently viewed |
| `/cart` | Bag with quantities, promotion codes, free-delivery threshold |
| `/checkout` | Four steps — contact, delivery, payment, review — with validation and a confirmation screen |
| `/wishlist` | Saved pieces, move to bag |
| `/login` | Sign in / create account |
| `/account` | Orders, wishlist, details, addresses |
| `/about` | House story, principles, timeline, journal |
| `/contact` | Form, store and workshop details, FAQ link |
| `/faq` | Anti-tarnish and plating explained, bangle and chain sizing tables, what is included |
| `/shipping-returns` | Delivery, returns, exclusions, the two-year promise |
| `/privacy`, `/terms` | Policy pages on a shared layout |

---

## Virtual Try-On (front-end demonstration)

`Product → Try It On → upload a photograph → render → adjust → before/after → add to bag.`

The render is a real composite, not a canned image. Each try-on plate is a jewellery frame shot on
a true-black studio ground, cropped and passed through a smooth luma gate
(`scripts/build-tryon.mjs`) so the surrounding grey falls to pure black. The browser drops it onto
the guest's photograph with `mix-blend-mode: screen`, leaving only metal and stones visible. The
guest can drag to reposition, scale against the piece's true size, rotate, and toggle Compare to
see the photograph without it.

The staged "Reading the photograph → Finding the neckline → …" sequence is a timed animation. **No
network request is made and the photograph never leaves the browser** — it is held as an object URL
and revoked on close. The interface says so, in the modal and on the home page.

Seven plates cover neck, ear, wrist, ankle and waist positions (`public/tryon/`), mapped per
product through `product.tryOn`. Nose pins deliberately have no try-on: no plate would be honest.

---

## Structure

```
src/
  app/                     routes; server components that await params/searchParams
  components/
    layout/                header, mobile nav, footer, cart drawer, search, toasts,
                           preloader, page transitions, Lenis smooth scroll
    ui/                    motion primitives, buttons, logo lock-ups, accordion,
                           stars, quantity, portal
    home/                  the nine home-page sections
    shop/                  product card, quick view, the shop view + filters
    product/               gallery, info panel, reviews, try-on modal, related strips
    collections/           collection index, product grid
    cart/                  cart, wishlist and checkout views
    account/               auth and account views
    contact/               contact form
  lib/
    data/                  products, collections, reviews, site copy — all mock
    store.tsx              cart, wishlist, recently viewed, mock auth, overlays, toasts
    types.ts, utils.ts
scripts/                   asset pipeline and verification tooling (dev only)
```

### State

One client store (`src/lib/store.tsx`) stands in for the backend: bag, wishlist, recently viewed
and a mock signed-in customer, persisted to `localStorage` under `ritza.store.v1` and guarded
against private-mode failures. Overlay state (bag drawer, search, mobile nav) and the toast queue
live there too.

Full-screen overlays render through `components/ui/Portal.tsx`. The page transition wraps content
in a transformed `<main>`, which creates a stacking context — without the portal a modal would sit
underneath the fixed header no matter its `z-index`.

### Motion

Framer Motion throughout, Lenis for smooth scrolling. The vocabulary is deliberately small and
reused so it reads as a system rather than a showreel:

- content rises 26px into place on entry (`Reveal`)
- one heading per section lifts out of a mask, word by word (`TextReveal`)
- images settle out of a slight over-scale behind a lifting curtain (`ImageReveal`)
- full-bleed frames drift 40–90px against the scroll (`Parallax`)
- buttons fill from the baseline; links draw an underline from the left

Everything honours `prefers-reduced-motion`, which collapses animation to near-zero duration and
disables Lenis.

---

## Verification tooling

The scripts in `scripts/` are development tools, not part of the app:

| Script | Purpose |
| --- | --- |
| `build-logo.mjs` | Brand lock-ups and favicon from the supplied artwork |
| `build-tryon.mjs` | Try-on plates from black-ground product frames |
| `build-tryon-demo.mjs` | The before/after pair used by the home-page showcase |
| `fetch-images.mjs` | Downloads the photography set |
| `fetch-replacements.mjs` | Downloads the modest-imagery replacement set |
| `fetch-catalogue.mjs` | Downloads the two-line catalogue photography |
| `image-usage.mjs` | Maps every image to the file that references it |
| `shoot.mjs` | Full-page and viewport screenshots of any route, desktop or mobile |
| `overflow-check.mjs` | Flags horizontal overflow at 390px — how "responsive" quietly breaks |
| `a11y-check.mjs` | Alt text, accessible names, heading order, labelled inputs |
| `tryon-check.mjs`, `flow-check.mjs` | Drive try-on, search, quick view and checkout end to end |

They need Chrome at the path set in each file and the dev server running.

---

## Notes for the review

- **Photography is placeholder.** The images in `public/images/` are stock, downloaded from
  Pexels under its licence, and stand in for a real shoot. Every piece in the catalogue is
  fictional, as are the reviews, prices, addresses and the press quotes.
- **Imagery standard.** Every model frame on the site is fully clothed — shirts, blazers, knits,
  abayas and hijabs — and each one shows the jewellery. Anything revealing was removed from
  `public/images/` outright rather than merely unreferenced, so it cannot be wired back in, and
  the download manifest in `scripts/fetch-images.mjs` no longer lists it. `scripts/image-usage.mjs`
  maps every frame to the file that uses it if you want to re-audit.
- **The prototype says so where it matters.** The payment step, the contact form, the account
  sign-in and the try-on each state plainly that nothing is transmitted, charged or stored.
- **Promotion codes** `RITZA10` (10%) and `BAZAAR` (15%) work in the bag, for demonstration.
- **Not built, by design:** backend, database, real payments, real authentication, a real
  try-on model, CMS, search indexing, analytics.
