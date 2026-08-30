import { GiftBoxProvider } from "@/lib/giftbox-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingGiftBoxButton } from "@/components/FloatingGiftBoxButton";
import { GiftBoxDrawer } from "@/components/GiftBoxDrawer";
import { createClient } from "@/lib/supabase/server";
import type { Discount, SiteSettings } from "@/lib/types";

async function getSiteData() {
  const supabase = await createClient();
  const [{ data: settings }, { data: discounts }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("discounts").select("*").eq("is_active", true),
  ]);
  return {
    settings: settings as SiteSettings | null,
    discounts: (discounts ?? []) as Discount[],
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, discounts } = await getSiteData();

  return (
    <GiftBoxProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingGiftBoxButton />
      <GiftBoxDrawer settings={settings} discounts={discounts} />
    </GiftBoxProvider>
  );
}
