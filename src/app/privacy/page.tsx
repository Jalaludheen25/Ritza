import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { privacyPolicy } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Ritza collects, what it never collects, and why your Try-On photograph never leaves your browser.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy notice"
      lede="Short version: we collect what an order needs, we do not sell it, and Try-On photographs never reach us at all."
      sections={privacyPolicy}
      current="/privacy"
    />
  );
}
