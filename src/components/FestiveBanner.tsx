import { CountdownTimer } from "@/components/CountdownTimer";
import { isFestiveBannerActive } from "@/lib/festive";
import type { SiteSettings } from "@/lib/types";

export function FestiveBanner({ settings }: { settings: SiteSettings | null }) {
  if (!isFestiveBannerActive(settings)) {
    return null;
  }

  return (
    <div className="bg-[var(--accent)] text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="font-medium">
          {settings.festive_banner_message ?? "Festive offer live now"}
        </span>
        <span aria-hidden>·</span>
        <CountdownTimer endAt={settings.festive_banner_end_at} />
      </div>
    </div>
  );
}
