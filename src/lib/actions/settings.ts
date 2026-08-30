"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/require-admin";

export async function updateContactSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      address: String(formData.get("address") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      hero_tagline: String(formData.get("hero_tagline") ?? "") || null,
      hero_banner_url: String(formData.get("hero_banner_url") ?? "") || null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/");
  return { success: true };
}

export async function updateWhatsAppSettings(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: String(formData.get("whatsapp_number") ?? "") || null,
      whatsapp_message_template:
        String(formData.get("whatsapp_message_template") ?? "") || null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/");
  return { success: true };
}

export async function updateFestiveBanner(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const endAtRaw = String(formData.get("festive_banner_end_at") ?? "");

  const { error } = await supabase
    .from("site_settings")
    .update({
      festive_banner_enabled: formData.get("festive_banner_enabled") === "on",
      festive_banner_message: String(formData.get("festive_banner_message") ?? "") || null,
      festive_banner_end_at: endAtRaw ? new Date(endAtRaw).toISOString() : null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/festive-banner");
  revalidatePath("/");
  return { success: true };
}

export async function resetFestiveBanner() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      festive_banner_enabled: false,
      festive_banner_end_at: null,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/festive-banner");
  revalidatePath("/");
  return { success: true };
}
