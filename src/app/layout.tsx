import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

import { StoreProvider, HeaderToneProvider } from "@/lib/store";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/layout/Preloader";
import { PageTransition } from "@/components/layout/PageTransition";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { Toasts } from "@/components/layout/Toasts";
import { Footer } from "@/components/layout/Footer";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ritza.ae"),
  title: {
    default: "Ritza — Anti-Tarnish & Kerala Traditional Jewellery, Dubai",
    template: "%s — Ritza",
  },
  description:
    "Two lines from one Dubai workshop — 316L anti-tarnish steel you can swim in, and Kerala temple jewellery cast in Thrissur.",
  openGraph: {
    title: "Ritza — Anti-Tarnish & Kerala Traditional Jewellery, Dubai",
    description:
      "Anti-tarnish steel and Kerala temple jewellery, delivered across the UAE.",
    type: "website",
    locale: "en_AE",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1b38",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <StoreProvider>
          <HeaderToneProvider>
            <SmoothScroll />
            <Preloader />

            <a
              href="#main"
              className="eyebrow sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[130] focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory"
            >
              Skip to content
            </a>

            <Header />
            <MobileNav />
            <SearchOverlay />
            <CartDrawer />
            <Toasts />

            <PageTransition>{children}</PageTransition>

            <Footer />
          </HeaderToneProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
