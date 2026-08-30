"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/require-admin";

function parseDiscountForm(formData: FormData) {
  const appliesTo = String(formData.get("applies_to") ?? "all");
  return {
    name: String(formData.get("name") ?? "").trim(),
    type: String(formData.get("type") ?? "percentage"),
    value: Number(formData.get("value") ?? 0),
    applies_to: appliesTo,
    category_id: appliesTo === "category" ? String(formData.get("category_id") ?? "") || null : null,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createDiscount(formData: FormData) {
  await requireAdmin();
  const parsed = parseDiscountForm(formData);
  if (!parsed.name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("discounts").insert(parsed);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/discounts");
  revalidatePath("/");
  return { success: true };
}

export async function updateDiscount(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseDiscountForm(formData);
  if (!parsed.name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("discounts").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/discounts");
  revalidatePath("/");
  return { success: true };
}

export async function deleteDiscount(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("discounts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/discounts");
  revalidatePath("/");
  return { success: true };
}

export async function toggleDiscountActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("discounts")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/discounts");
  revalidatePath("/");
  return { success: true };
}
