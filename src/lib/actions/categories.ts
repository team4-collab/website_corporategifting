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

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? "") || null,
    image_url: String(formData.get("image_url") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      description: String(formData.get("description") ?? "") || null,
      image_url: String(formData.get("image_url") ?? "") || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/categories");
  revalidatePath("/");
  return { success: true };
}
