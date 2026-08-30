"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/require-admin";

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);

  const { error: insertError } = await supabase.from("media_library").insert({
    storage_path: path,
    url: publicUrl.publicUrl,
    filename: file.name,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/dashboard/media");
  return { success: true, url: publicUrl.publicUrl };
}

export async function deleteMedia(id: string, storagePath: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.storage.from("media").remove([storagePath]);
  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/media");
  return { success: true };
}
