import type { SiteSettings } from "@/lib/types";

export function isFestiveBannerActive(
  settings: SiteSettings | null,
): settings is SiteSettings & { festive_banner_end_at: string } {
  if (!settings?.festive_banner_enabled || !settings.festive_banner_end_at) {
    return false;
  }
  return new Date(settings.festive_banner_end_at).getTime() > Date.now();
}
