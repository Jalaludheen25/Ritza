import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Ritza order.",
};

export default function CheckoutPage() {
  return (
    <div className="pt-[96px] md:pt-[120px]">
      <CheckoutView />
    </div>
  );
}
