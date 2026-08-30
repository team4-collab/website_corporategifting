"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/require-admin";
import type { EnquiryItem, EnquiryStatus } from "@/lib/types";

export type SubmitEnquiryInput = {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  deliveryCity?: string;
  message?: string;
  items: EnquiryItem[];
  subtotal: number | null;
  discountApplied: { name: string; amount: number } | null;
  total: number | null;
};

export async function submitEnquiry(input: SubmitEnquiryInput) {
  if (!input.name || !input.email || !input.phone) {
    return { error: "Name, email, and phone are required." };
  }
  if (input.items.length === 0) {
    return { error: "Your gift box is empty." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("enquiries").insert({
    name: input.name,
    company_name: input.companyName || null,
    email: input.email,
    phone: input.phone,
    delivery_city: input.deliveryCity || null,
    message: input.message || null,
    items: input.items,
    subtotal: input.subtotal,
    discount_applied: input.discountApplied,
    total: input.total,
  });

  if (error) {
    return { error: "Something went wrong submitting your enquiry. Please try again." };
  }

  return { success: true };
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/dashboard/enquiries");
}
