import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Account",
  description: "Your orders, saved pieces and details.",
};

export default function AccountPage() {
  return (
    <div className="pt-[86px] md:pt-[104px]">
      <AccountView />
    </div>
  );
}
