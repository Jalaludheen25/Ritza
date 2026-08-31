"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "An appointment at the salon",
  "A piece I am considering",
  "A commission",
  "Sizing or alteration",
  "Repair and care",
  "An existing order",
  "Something else",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Tell us your name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.message.trim().length < 10) next.message = "A sentence or two, please";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 1100);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="border border-ink/12 p-9 text-center"
          >
            <p className="eyebrow text-gold-3">Message received</p>
            <p className="display mt-5 text-[2rem] leading-tight">
              Thank you, {form.name.split(" ")[0]}
            </p>
            <p className="lede mx-auto mt-4 max-w-sm text-[14px]">
              Somebody from the atelier will write back within one working day. If it is urgent,
              call us — we answer the phone.
            </p>
            <Button
              variant="outline"
              className="mt-8"
              onClick={() => {
                setSent(false);
                setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
              }}
            >
              Send another
            </Button>
            <p className="eyebrow mt-8 text-[9px] opacity-35">
              Prototype — nothing was actually sent
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                autoComplete="email"
              />
            </div>

            <Field
              label="Telephone (optional)"
              type="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              autoComplete="tel"
            />

            <label className="mt-6 block">
              <span className="eyebrow text-[9px] opacity-55">What is it about?</span>
              <select
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className="field mt-1 cursor-pointer appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%230b1b38' fill='none'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 2px center",
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="mt-6 block">
              <span className="eyebrow text-[9px] opacity-55">Message</span>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={5}
                className={cn("field mt-1 resize-none", errors.message && "border-b-gold-3")}
                placeholder="Tell us what you are looking for, and when you would like to come in."
              />
              {errors.message && (
                <span className="mt-1.5 block text-[12px] text-gold-3">{errors.message}</span>
              )}
            </label>

            <Button type="submit" variant="ink" className="mt-9 w-full sm:w-auto" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Button>

            <p className="mt-5 text-[12px] leading-relaxed opacity-45">
              We reply within one working day, Saturday to Thursday. This prototype does not
              transmit anything.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
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
    <label className="mt-6 block first:mt-0 sm:first:mt-6">
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
