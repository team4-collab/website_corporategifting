"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useGiftBox } from "@/lib/giftbox-context";
import { computeDiscount } from "@/lib/discounts";
import { buildGiftBoxMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { submitEnquiry } from "@/lib/actions/enquiries";
import type { Discount, SiteSettings } from "@/lib/types";

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
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Gift Box</h2>
          <button onClick={closeDrawer} className="text-muted hover:text-foreground">
            ✕
          </button>
        </div>

        {status === "done" ? (
          <div className="mt-8 text-center">
            <p className="text-lg font-medium">Thanks! 🎁</p>
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
          <p className="mt-8 text-sm text-muted">Your gift box is empty.</p>
        ) : (
          <>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-border">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.showPrice && item.price != null && (
                      <p className="text-sm text-muted">₹{item.price} each</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-border text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-border text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-2 text-xs text-muted underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {subtotal > 0 && (
              <div className="mt-6 space-y-1 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-accent">
                    <span>{discount.name}</span>
                    <span>−₹{discount.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <input
                placeholder="Delivery City"
                value={form.deliveryCity}
                onChange={(e) => setForm({ ...form, deliveryCity: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Message / Notes (optional)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                rows={3}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
              </button>

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-full border border-border px-4 py-2 text-center text-sm font-medium hover:bg-background"
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
