import type { Discount, GiftBoxItem } from "@/lib/types";

export type AppliedDiscount = { name: string; amount: number } | null;

/**
 * Applies the first active discount that matches (all-products discounts
 * take priority over category-scoped ones). Amount is rounded to 2dp.
 */
export function computeDiscount(
  items: GiftBoxItem[],
  discounts: Discount[],
): AppliedDiscount {
  const active = discounts.filter((d) => d.is_active);
  if (active.length === 0) return null;

  const allDiscount = active.find((d) => d.applies_to === "all");
  const target = allDiscount ?? active[0];

  const eligibleSubtotal = items.reduce((sum, i) => {
    if (!i.showPrice || !i.price) return sum;
    if (target.applies_to === "category" && i.categoryId !== target.category_id) {
      return sum;
    }
    return sum + i.price * i.quantity;
  }, 0);

  if (eligibleSubtotal <= 0) return null;

  const amount =
    target.type === "percentage"
      ? (eligibleSubtotal * target.value) / 100
      : Math.min(target.value, eligibleSubtotal);

  return { name: target.name, amount: Math.round(amount * 100) / 100 };
}
