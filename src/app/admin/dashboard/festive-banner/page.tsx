import { createAdminClient } from "@/lib/supabase/server";
import { resetFestiveBanner, updateFestiveBanner } from "@/lib/actions/settings";
import type { SiteSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<SiteSettings | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data;
}

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default async function FestiveBannerAdminPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Festive Discount Timer</h1>
        <p className="mt-1 text-sm text-muted">
          Controls the countdown banner shown on the homepage.
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await updateFestiveBanner(formData);
        }}
        className="space-y-3 rounded-2xl border border-border bg-card p-5"
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="festive_banner_enabled"
            defaultChecked={settings?.festive_banner_enabled}
          />
          Show festive banner
        </label>

        <textarea
          name="festive_banner_message"
          placeholder="Diwali Special: 15% off festive gifting — ends in:"
          defaultValue={settings?.festive_banner_message ?? ""}
          rows={2}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />

        <div>
          <label className="mb-1 block text-sm font-medium">Countdown ends at</label>
          <input
            type="datetime-local"
            name="festive_banner_end_at"
            defaultValue={toLocalInputValue(settings?.festive_banner_end_at ?? null)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Save
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await resetFestiveBanner();
        }}
      >
        <button className="text-sm text-red-600 underline">
          Reset Timer (turn off banner and clear end date)
        </button>
      </form>
    </div>
  );
}
