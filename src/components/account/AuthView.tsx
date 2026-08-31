"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

type Mode = "signin" | "register";

export function AuthView() {
  const router = useRouter();
  const { signIn } = useStore();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) next.name = "Tell us your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.password.length < 6) next.password = "At least six characters";
    if (mode === "register" && form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setTimeout(() => {
      signIn({
        name: form.name.trim() || form.email.split("@")[0].replace(/[._-]/g, " "),
        email: form.email,
      });
      router.push("/account");
    }, 900);
  };

  return (
    <div className="grid min-h-[100svh] pt-[62px] md:pt-[76px] lg:grid-cols-2">
      {/* image side */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/pearl-necklace-red-lips.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="display max-w-md text-ivory text-[2.5rem] leading-tight">
            An account keeps your sizes, your certificates and your care history in one place.
          </p>
          <p className="eyebrow mt-6 text-[9px] text-ivory/45">Ritza — Alserkal Avenue, Dubai</p>
        </div>
      </div>

      {/* form side */}
      <div className="flex items-center justify-center px-5 py-24 md:px-12">
        <div className="w-full max-w-sm">
          <p className="eyebrow text-gold-3">Your account</p>
          <h1 className="display mt-5 text-[2.5rem] leading-none">
            {mode === "signin" ? "Welcome back" : "Join the house"}
          </h1>

          <div className="mt-11 flex gap-7 border-b border-ink/10">
            {(["signin", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setErrors({});
                }}
                className="relative pb-3"
              >
                <span
                  className={cn(
                    "eyebrow transition-colors duration-500",
                    mode === m ? "text-ink" : "text-ink/35",
                  )}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </span>
                {mode === m && (
                  <motion.span
                    layoutId="auth-underline"
                    className="absolute inset-x-0 -bottom-px h-px bg-gold"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {mode === "register" && (
                  <AuthField
                    label="Full name"
                    value={form.name}
                    onChange={(v) => set("name", v)}
                    error={errors.name}
                    autoComplete="name"
                  />
                )}
                <AuthField
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  autoComplete="email"
                />
                <AuthField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={(v) => set("password", v)}
                  error={errors.password}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
                {mode === "register" && (
                  <AuthField
                    label="Confirm password"
                    type="password"
                    value={form.confirm}
                    onChange={(v) => set("confirm", v)}
                    error={errors.confirm}
                    autoComplete="new-password"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {mode === "signin" && (
              <div className="mt-5 flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-[13px] opacity-60">
                  <input type="checkbox" className="accent-[var(--color-ink)]" />
                  Keep me signed in
                </label>
                <Link href="/contact" className="link-line text-[13px] opacity-60">
                  Forgotten?
                </Link>
              </div>
            )}

            <Button type="submit" variant="ink" className="mt-9 w-full" disabled={busy}>
              {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>

            {mode === "register" && (
              <p className="mt-5 text-[12px] leading-relaxed opacity-50">
                By creating an account you agree to our terms and privacy notice. We never share an
                address.
              </p>
            )}
          </form>

          <div className="mt-10 border-t border-ink/10 pt-7">
            <p className="eyebrow text-[9px] opacity-40">Prototype</p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed opacity-55">
              No account is actually created — any valid-looking email and a six-character password
              will take you into the account area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthField({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="mt-6 block first:mt-0">
      <span className="eyebrow text-[9px] opacity-55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={cn("field mt-1", error && "border-b-gold-3")}
        aria-invalid={!!error}
      />
      {error && <span className="mt-1.5 block text-[12px] text-gold-3">{error}</span>}
    </label>
  );
}
