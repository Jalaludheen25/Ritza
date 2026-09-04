import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { termsPolicy } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of sale for Ritza Jewellery Trading LLC, Dubai.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Terms of sale"
      lede="Plainly written, and honest about what the two lines are made of — because that is the part people most need to know."
      sections={termsPolicy}
      current="/terms"
    />
  );
}
