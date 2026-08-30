"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/require-admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseProductForm(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();
  const categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "") || null,
    price: priceRaw ? Number(priceRaw) : null,
    show_price: formData.get("show_price") === "on",
    image_url: String(formData.get("image_url") ?? "") || null,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    categoryIds,
  };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: parsed.name,
      slug: slugify(parsed.name),
      description: parsed.description,
      price: parsed.price,
      show_price: parsed.show_price,
      image_url: parsed.image_url,
      is_active: parsed.is_active,
      sort_order: parsed.sort_order,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (parsed.categoryIds.length > 0) {
    await supabase.from("product_categories").insert(
      parsed.categoryIds.map((category_id) => ({
        product_id: product.id,
        category_id,
      })),
    );
  }

  revalidatePath("/admin/dashboard/products");
  revalidatePath("/build-your-gift-box");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      slug: slugify(parsed.name),
      description: parsed.description,
      price: parsed.price,
      show_price: parsed.show_price,
      image_url: parsed.image_url,
      is_active: parsed.is_active,
      sort_order: parsed.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("product_categories").delete().eq("product_id", id);
  if (parsed.categoryIds.length > 0) {
    await supabase.from("product_categories").insert(
      parsed.categoryIds.map((category_id) => ({
        product_id: id,
        category_id,
      })),
    );
  }

  revalidatePath("/admin/dashboard/products");
  revalidatePath("/build-your-gift-box");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/products");
  revalidatePath("/build-your-gift-box");
  return { success: true };
}
