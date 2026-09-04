import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { shippingPolicy } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Same-day delivery in Dubai, next day across the UAE, and thirty days to change your mind.",
};

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Client care"
      title="Shipping & returns"
      lede="Free over AED 200, same day in Dubai, and thirty days to send it back if it is not right."
      sections={shippingPolicy}
      current="/shipping-returns"
    />
  );
}
