"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { Monogram } from "@/components/ui/Logo";
import { FREE_SHIPPING, VAT_RATE } from "./CartView";

/* Four steps against a running order summary. Everything is validated and
   held in component state — this prototype takes no payment and talks to
   no server. */

type Step = 0 | 1 | 2 | 3;

const STEPS = ["Contact", "Delivery", "Payment", "Review"];

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    name: "Insured standard",
    detail: "2–5 working days, signature required",
    price: 0,
  },
  {
    id: "express",
    name: "Insured express",
    detail: "Next working day within the UAE",
    price: 90,
  },
  {
    id: "atelier",
    name: "Collect from the atelier",
    detail: "Alserkal Avenue, ready in 24 hours",
    price: 0,
  },
];

type Form = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  emirate: string;
  country: string;
  delivery: string;
  giftWrap: boolean;
  giftNote: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const EMPTY: Form = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "Dubai",
  emirate: "Dubai",
  country: "United Arab Emirates",
  delivery: "standard",
  giftWrap: false,
  giftNote: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export function CheckoutView() {
  const { cart, subtotal, clearCart, hydrated } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [placing, setPlacing] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === form.delivery)!;
  const deliveryCost =
    subtotal >= FREE_SHIPPING && deliveryOption.id === "standard" ? 0 : deliveryOption.price;
  const giftCost = form.giftWrap ? 75 : 0;
  const total = subtotal + deliveryCost + giftCost;
  const vat = Math.round(total - total / (1 + VAT_RATE));

  const validate = (target: Step) => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (target > 0) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email address";
      if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a contact number";
    }
    if (target > 1) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim()) e.lastName = "Required";
      if (form.delivery !== "atelier") {
        if (!form.address.trim()) e.address = "Required";
        if (!form.city.trim()) e.city = "Required";
      }
    }
    if (target > 2) {
      if (!form.cardName.trim()) e.cardName = "Required";
      if (form.cardNumber.replace(/\s/g, "").length < 15) e.cardNumber = "Enter a card number";
      if (!/^\d{2}\s?\/\s?\d{2}$/.test(form.expiry)) e.expiry = "MM / YY";
      if (form.cvc.length < 3) e.cvc = "3 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const go = (target: Step) => {
    if (target > step && !validate(target)) return;
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = () => {
    if (!validate(3)) return;
    setPlacing(true);
    setTimeout(() => {
      setOrderRef(`RZ-${Math.floor(100000 + Math.random() * 899999)}`);
      clearCart();
      setPlacing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1700);
  };

  const lines = useMemo(
    () =>
      cart
        .map((l) => ({ line: l, product: getProduct(l.slug) }))
        .filter((x) => x.product) as { line: (typeof cart)[number]; product: NonNullable<ReturnType<typeof getProduct>> }[],
    [cart],
  );

  if (orderRef) return <Confirmation orderRef={orderRef} email={form.email} option={deliveryOption} />;

  if (!hydrated) return <div className="shell min-h-[50vh] py-20" />;

  if (cart.length === 0) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="display text-[clamp(2rem,1.4rem+2.4vw,3.5rem)]">There is nothing to check out</h1>
        <p className="lede mx-auto mt-5 max-w-md">Your bag is empty.</p>
        <ButtonLink href="/shop" variant="ink" className="mt-9">
          Browse the collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="shell py-4 md:py-6">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-3/60" />
          <span className="eyebrow text-gold-3">Step two of two</span>
        </div>
        <h1 className="display mt-6 text-[clamp(2.25rem,1.5rem+3.4vw,4.25rem)]">Checkout</h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* forms */}
        <div className="lg:col-span-7">
          {/* progress */}
          <ol className="flex items-center gap-2 border-b border-ink/10 pb-5">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && go(i as Step)}
                  disabled={i > step}
                  className={cn(
                    "eyebrow flex items-center gap-2 text-[9px] transition-colors duration-500",
                    i === step ? "text-ink" : i < step ? "text-gold-3" : "text-ink/25",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border text-[9px] tabular-nums",
                      i === step
                        ? "border-ink bg-ink text-ivory"
                        : i < step
                          ? "border-gold bg-gold text-ink"
                          : "border-ink/20",
                    )}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink/12" />}
              </li>
            ))}
          </ol>

          <div className="mt-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {step === 0 && (
                  <Section title="Contact" caption="Where we send the confirmation and tracking.">
                    <Field
                      label="Email address"
                      value={form.email}
                      onChange={(v) => set("email", v)}
                      error={errors.email}
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label="Mobile number"
                      value={form.phone}
                      onChange={(v) => set("phone", v)}
                      error={errors.phone}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+971 50 000 0000"
                    />
                    <label className="mt-6 flex items-start gap-3 text-[13px] opacity-65">
                      <input type="checkbox" defaultChecked className="mt-1 accent-[var(--color-ink)]" />
                      <span>
                        Send me the house letter — new pieces and private viewings, six times a
                        year.
                      </span>
                    </label>
                  </Section>
                )}

                {step === 1 && (
                  <Section title="Delivery" caption="Fully insured, signature on receipt.">
                    <div className="grid gap-x-5 sm:grid-cols-2">
                      <Field
                        label="First name"
                        value={form.firstName}
                        onChange={(v) => set("firstName", v)}
                        error={errors.firstName}
                        autoComplete="given-name"
                      />
                      <Field
                        label="Last name"
                        value={form.lastName}
                        onChange={(v) => set("lastName", v)}
                        error={errors.lastName}
                        autoComplete="family-name"
                      />
                    </div>

                    <div className="mt-8 space-y-2.5">
                      {DELIVERY_OPTIONS.map((o) => {
                        const cost = subtotal >= FREE_SHIPPING && o.id === "standard" ? 0 : o.price;
                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => set("delivery", o.id)}
                            className={cn(
                              "flex w-full items-center justify-between gap-4 border p-4 text-left transition-colors duration-300",
                              form.delivery === o.id
                                ? "border-ink bg-ivory-2"
                                : "border-ink/15 hover:border-ink/40",
                            )}
                          >
                            <span className="flex items-center gap-4">
                              <span
                                className={cn(
                                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                                  form.delivery === o.id ? "border-ink" : "border-ink/25",
                                )}
                              >
                                {form.delivery === o.id && (
                                  <span className="block h-2 w-2 rounded-full bg-gold" />
                                )}
                              </span>
                              <span>
                                <span className="block text-[14.5px]">{o.name}</span>
                                <span className="mt-0.5 block text-[12.5px] opacity-50">
                                  {o.detail}
                                </span>
                              </span>
                            </span>
                            <span className="shrink-0 text-[13.5px] tabular-nums">
                              {cost === 0 ? "Complimentary" : formatPrice(cost)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {form.delivery !== "atelier" && (
                      <div className="mt-8">
                        <Field
                          label="Address"
                          value={form.address}
                          onChange={(v) => set("address", v)}
                          error={errors.address}
                          autoComplete="street-address"
                        />
                        <Field
                          label="Apartment, villa, floor (optional)"
                          value={form.apartment}
                          onChange={(v) => set("apartment", v)}
                        />
                        <div className="grid gap-x-5 sm:grid-cols-3">
                          <Field
                            label="City"
                            value={form.city}
                            onChange={(v) => set("city", v)}
                            error={errors.city}
                          />
                          <Field
                            label="Emirate / region"
                            value={form.emirate}
                            onChange={(v) => set("emirate", v)}
                          />
                          <Field
                            label="Country"
                            value={form.country}
                            onChange={(v) => set("country", v)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-8 border-t border-ink/10 pt-7">
                      <label className="flex items-start gap-3 text-[13.5px]">
                        <input
                          type="checkbox"
                          checked={form.giftWrap}
                          onChange={(e) => set("giftWrap", e.target.checked)}
                          className="mt-1 accent-[var(--color-ink)]"
                        />
                        <span>
                          <span className="block">Gift presentation — {formatPrice(75)}</span>
                          <span className="mt-1 block text-[12.5px] opacity-50">
                            Lacquered box, hand-tied ribbon, and a card written in the atelier.
                          </span>
                        </span>
                      </label>
                      {form.giftWrap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <Field
                            label="Message on the card (optional)"
                            value={form.giftNote}
                            onChange={(v) => set("giftNote", v)}
                          />
                        </motion.div>
                      )}
                    </div>
                  </Section>
                )}

                {step === 2 && (
                  <Section title="Payment" caption="Encrypted, and never stored by us.">
                    <div className="mb-7 flex items-center gap-3 bg-ivory-2 p-4">
                      <Monogram className="w-4 shrink-0 opacity-60" />
                      <p className="text-[12.5px] leading-relaxed opacity-60">
                        This is a front-end prototype. No card is charged and nothing is
                        transmitted — enter any numbers you like.
                      </p>
                    </div>

                    <Field
                      label="Name on card"
                      value={form.cardName}
                      onChange={(v) => set("cardName", v)}
                      error={errors.cardName}
                      autoComplete="cc-name"
                    />
                    <Field
                      label="Card number"
                      value={form.cardNumber}
                      onChange={(v) =>
                        set(
                          "cardNumber",
                          v
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        )
                      }
                      error={errors.cardNumber}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                    />
                    <div className="grid gap-x-5 sm:grid-cols-2">
                      <Field
                        label="Expiry"
                        value={form.expiry}
                        onChange={(v) => {
                          const d = v.replace(/\D/g, "").slice(0, 4);
                          set("expiry", d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d);
                        }}
                        error={errors.expiry}
                        placeholder="MM / YY"
                        inputMode="numeric"
                      />
                      <Field
                        label="Security code"
                        value={form.cvc}
                        onChange={(v) => set("cvc", v.replace(/\D/g, "").slice(0, 4))}
                        error={errors.cvc}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </Section>
                )}

                {step === 3 && (
                  <Section title="Review" caption="One last look before it goes to the bench.">
                    <dl className="divide-y divide-ink/10 border-y border-ink/10">
                      <ReviewRow label="Contact" onEdit={() => go(0)}>
                        {form.email}
                        <br />
                        {form.phone}
                      </ReviewRow>
                      <ReviewRow label="Delivery" onEdit={() => go(1)}>
                        {form.firstName} {form.lastName}
                        <br />
                        {form.delivery === "atelier" ? (
                          "Collection — Alserkal Avenue, Dubai"
                        ) : (
                          <>
                            {form.address}
                            {form.apartment ? `, ${form.apartment}` : ""}
                            <br />
                            {form.city}, {form.emirate}, {form.country}
                          </>
                        )}
                        <br />
                        <span className="opacity-55">{deliveryOption.name}</span>
                      </ReviewRow>
                      <ReviewRow label="Payment" onEdit={() => go(2)}>
                        {form.cardName}
                        <br />
                        •••• •••• •••• {form.cardNumber.slice(-4) || "····"}
                      </ReviewRow>
                      {form.giftWrap && (
                        <ReviewRow label="Gift" onEdit={() => go(1)}>
                          Gift presentation
                          {form.giftNote ? ` — “${form.giftNote}”` : ""}
                        </ReviewRow>
                      )}
                    </dl>
                  </Section>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => go((step - 1) as Step)}
                  className="link-line eyebrow text-[9px] opacity-55"
                >
                  Back
                </button>
              ) : (
                <Link href="/cart" className="link-line eyebrow text-[9px] opacity-55">
                  Back to bag
                </Link>
              )}

              {step < 3 ? (
                <Button variant="ink" onClick={() => go((step + 1) as Step)}>
                  Continue
                </Button>
              ) : (
                <Button variant="ink" onClick={placeOrder} disabled={placing}>
                  {placing ? "Placing order…" : `Place order — ${formatPrice(total)}`}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* summary */}
        <div className="lg:col-span-5">
          <div className="bg-ivory-2 p-7 lg:sticky lg:top-[110px] md:p-8">
            <p className="eyebrow">Your order</p>
            <ul className="mt-6 space-y-5">
              {lines.map(({ line, product }) => (
                <li key={`${line.slug}-${line.size ?? ""}`} className="flex gap-4">
                  <div className="relative aspect-[3/4] w-[64px] shrink-0 overflow-hidden bg-sand">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] text-ivory tabular-nums">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px]">{product.name}</p>
                    <p className="mt-0.5 text-[12px] opacity-50">
                      {line.size ? `Size ${line.size}` : product.tagline}
                    </p>
                    {line.engraving && (
                      <p className="mt-0.5 text-[12px] text-gold-3">“{line.engraving}”</p>
                    )}
                  </div>
                  <p className="shrink-0 text-[13px] tabular-nums">
                    {formatPrice(product.price * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-7 space-y-3 border-t border-ink/12 pt-6 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="opacity-60">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="opacity-60">{deliveryOption.name}</dt>
                <dd className="tabular-nums">
                  {deliveryCost === 0 ? "Complimentary" : formatPrice(deliveryCost)}
                </dd>
              </div>
              {form.giftWrap && (
                <div className="flex justify-between">
                  <dt className="opacity-60">Gift presentation</dt>
                  <dd className="tabular-nums">{formatPrice(giftCost)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-ink/12 pt-5">
              <p className="eyebrow">Total</p>
              <p className="display text-[1.6rem] tabular-nums">{formatPrice(total)}</p>
            </div>
            <p className="mt-2 text-[12px] opacity-45">Includes {formatPrice(vat)} VAT at 5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- pieces */

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="display text-[1.9rem]">{title}</h2>
      <p className="mt-1.5 text-[13px] opacity-50">{caption}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="eyebrow text-[9px] opacity-55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={cn("field mt-1", error && "border-b-gold-3")}
        aria-invalid={!!error}
      />
      {error && <span className="mt-1.5 block text-[12px] text-gold-3">{error}</span>}
    </label>
  );
}

function ReviewRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-5">
      <div>
        <dt className="eyebrow text-[9px] opacity-45">{label}</dt>
        <dd className="mt-2.5 text-[13.5px] leading-relaxed">{children}</dd>
      </div>
      <button type="button" onClick={onEdit} className="link-line eyebrow text-[9px] text-gold-3">
        Edit
      </button>
    </div>
  );
}

function Confirmation({
  orderRef,
  email,
  option,
}: {
  orderRef: string;
  email: string;
  option: (typeof DELIVERY_OPTIONS)[number];
}) {
  return (
    <div className="shell py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-2xl text-center"
      >
        <div className="flex justify-center">
          <Monogram className="w-12" />
        </div>
        <p className="eyebrow mt-8 text-gold-3">Order placed</p>
        <h1 className="display mt-5 text-[clamp(2.25rem,1.5rem+3.4vw,4rem)]">
          Thank you — it is with the atelier
        </h1>
        <p className="lede mx-auto mt-6 max-w-md">
          We have sent a confirmation to {email || "your inbox"}. Your pieces will be checked,
          boxed and photographed before they leave us.
        </p>

        <dl className="mx-auto mt-12 grid max-w-lg grid-cols-2 gap-y-8 border-y border-ink/10 py-8 text-left">
          <div>
            <dt className="eyebrow text-[9px] opacity-45">Order reference</dt>
            <dd className="mt-2.5 text-[15px] tabular-nums">{orderRef}</dd>
          </div>
          <div>
            <dt className="eyebrow text-[9px] opacity-45">Delivery</dt>
            <dd className="mt-2.5 text-[15px]">{option.name}</dd>
          </div>
          <div>
            <dt className="eyebrow text-[9px] opacity-45">Expected</dt>
            <dd className="mt-2.5 text-[15px]">
              {option.id === "express"
                ? "Tomorrow"
                : option.id === "atelier"
                  ? "Ready in 24 hours"
                  : "2–5 working days"}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-[9px] opacity-45">Included</dt>
            <dd className="mt-2.5 text-[15px]">Certification and lifetime care</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/account" variant="ink">
            Track this order
          </ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Continue shopping
          </ButtonLink>
        </div>

        <p className="eyebrow mt-10 text-[9px] opacity-35">
          Prototype — no payment was taken and no order was placed
        </p>
      </motion.div>
    </div>
  );
}
