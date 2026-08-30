import type { GiftBoxItem } from "@/lib/types";

export function buildWhatsAppLink(
  whatsappNumber: string,
  message: string,
): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildGiftBoxMessage(
  items: GiftBoxItem[],
  template: string | null,
): string {
  const lines = items.map(
    (i) => `- ${i.name} x${i.quantity}${i.showPrice && i.price ? ` (₹${i.price * i.quantity})` : ""}`,
  );
  const intro = template ?? "Hi! I'd like to enquire about a corporate gift order.";
  return [intro, "", "My gift box:", ...lines].join("\n");
}
