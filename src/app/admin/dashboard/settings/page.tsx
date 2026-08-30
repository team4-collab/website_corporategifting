import { createAdminClient } from "@/lib/supabase/server";
import { updateContactSettings, updateWhatsAppSettings } from "@/lib/actions/settings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<SiteSettings | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data;
}

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Contact & WhatsApp Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Populates the site footer, hero section, and WhatsApp buttons.
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await updateContactSettings(formData);
        }}
        className="space-y-3 rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="text-sm font-semibold">Hero & Contact Info</h2>
        <input
          name="hero_tagline"
          placeholder="Hero tagline"
          defaultValue={settings?.hero_tagline ?? ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <div>
          <p className="mb-1 text-sm font-medium">Hero banner image</p>
          <ImageUploader name="hero_banner_url" defaultValue={settings?.hero_banner_url} />
        </div>
        <textarea
          name="address"
          placeholder="Business address"
          defaultValue={settings?.address ?? ""}
          rows={2}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Phone number"
          defaultValue={settings?.phone ?? ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <input
          name="email"
          placeholder="Email"
          defaultValue={settings?.email ?? ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Save
        </button>
      </form>

      <form
        action={async (formData) => {
          "use server";
          await updateWhatsAppSettings(formData);
        }}
        className="space-y-3 rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="text-sm font-semibold">WhatsApp Redirection</h2>
        <input
          name="whatsapp_number"
          placeholder="WhatsApp number (with country code)"
          defaultValue={settings?.whatsapp_number ?? ""}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <textarea
          name="whatsapp_message_template"
          placeholder="Default pre-filled message"
          defaultValue={settings?.whatsapp_message_template ?? ""}
          rows={2}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Save
        </button>
      </form>
    </div>
  );
}
