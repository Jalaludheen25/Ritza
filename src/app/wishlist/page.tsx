import type { Metadata } from "next";
import { WishlistView } from "@/components/cart/WishlistView";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The pieces you have set aside.",
};

export default function WishlistPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">Saved for later</span>
          </div>
          <h1 className="display mt-6 text-[clamp(2.25rem,1.5rem+3.4vw,4.25rem)]">Wishlist</h1>
        </Reveal>
      </div>
      <WishlistView />
    </div>
  );
}
