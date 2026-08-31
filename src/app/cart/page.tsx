import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Shopping bag",
  description: "Your Ritza selection.",
};

export default function CartPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <div className="shell">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-3/60" />
            <span className="eyebrow text-gold-3">Step one of two</span>
          </div>
          <h1 className="display mt-6 text-[clamp(2.25rem,1.5rem+3.4vw,4.25rem)]">
            Shopping bag
          </h1>
        </Reveal>
      </div>
      <CartView />
    </div>
  );
}
