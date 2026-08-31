import type { Metadata } from "next";
import { AuthView } from "@/components/account/AuthView";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Ritza account, or create one.",
};

export default function LoginPage() {
  return <AuthView />;
}
