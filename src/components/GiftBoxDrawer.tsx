"use client";

import Image from "next/image";
import { CheckCircle2, Minus, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useGiftBox } from "@/lib/giftbox-context";
import { computeDiscount } from "@/lib/discounts";
import { buildGiftBoxMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { submitEnquiry } from "@/lib/actions/enquiries";
import type { Discount, SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-accent";

export function GiftBoxDrawer({
  settings,
  discounts = [],
}: {
  settings: SiteSettings | null;
  discounts?: Discount[];
}) {
  const { items, subtotal, isDrawerOpen, closeDrawer, removeItem, updateQuantity, clear } =
    useGiftBox();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    deliveryCity: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const discount = useMemo(() => computeDiscount(items, discounts), [items, discounts]);
  const total = Math.max(0, subtotal - (discount?.amount ?? 0));

  if (!isDrawerOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const result = await submitEnquiry({
      name: form.name,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone,
      deliveryCity: form.deliveryCity,
      message: form.message,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.showPrice ? i.price : null,
      })),
      subtotal: subtotal || null,
      discountApplied: discount,
      total: subtotal ? total : null,
    });

    if (result.error) {
      setStatus("error");
      setError(result.error);
      return;
    }

    setStatus("done");
    clear();
  }

  const whatsappHref = settings?.whatsapp_number
    ? buildWhatsAppLink(
        settings.whatsapp_number,
        buildGiftBoxMessage(items, settings.whatsapp_message_template),
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-card p-6 shadow-xl sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">Your Gift Box</h2>
          <button
            onClick={closeDrawer}
            aria-label="Close gift box"
            className="rounded-full p-1.5 text-muted transition hover:bg-background hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === "done" ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <CheckCircle2 className="h-12 w-12 text-accent" strokeWidth={1.5} />
            <p className="mt-4 font-display text-xl font-medium">Thanks!</p>
            <p className="mt-2 text-sm text-muted">
              Our team will reach out within 24 hours to finalize your order.
            </p>
            <button
              onClick={closeDrawer}
              className="mt-6 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground"
            >
              Continue Browsing
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="mt-10 text-sm text-muted">Your gift box is empty.</p>
        ) : (
          <>
            <ul className="mt-6 space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-border">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.showPrice && item.price != null && (
                      <p className="text-sm text-muted">₹{item.price} each</p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:text-foreground"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {subtotal > 0 && (
              <div className="mt-6 space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="tabular-nums">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-accent">
                    <span>{discount.name}</span>
                    <span className="tabular-nums">−₹{discount.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-base font-medium">
                  <span>Total</span>
                  <span className="tabular-nums">₹{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={inputClass}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Delivery City"
                value={form.deliveryCity}
                onChange={(e) => setForm({ ...form, deliveryCity: e.target.value })}
                className={inputClass}
              />
              <textarea
                placeholder="Message / Notes (optional)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={inputClass}
                rows={3}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
              </button>

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium transition hover:border-accent hover:bg-background"
                >
                  Continue on WhatsApp
                </a>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
