import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryCard } from "@/components/CategoryCard";
import { FestiveBanner } from "@/components/FestiveBanner";
import type { Category, SiteSettings } from "@/lib/types";

async function getHomepageData() {
  const supabase = await createClient();
  const [{ data: categories }, { data: settings }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);
  return {
    categories: (categories ?? []) as Category[],
    settings: settings as SiteSettings | null,
  };
}

export default async function HomePage() {
  const { categories, settings } = await getHomepageData();

  return (
    <>
      <FestiveBanner settings={settings} />

      <section className="relative overflow-hidden bg-card">
        {settings?.hero_banner_url && (
          <Image
            src={settings.hero_banner_url}
            alt=""
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Premium Corporate Gifting, Made Simple
          </h1>
          {settings?.hero_tagline && (
            <p className="mx-auto mt-3 max-w-xl text-muted">{settings.hero_tagline}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-foreground px-6 py-8 text-center text-background sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-semibold">Build Your Gift Box</h2>
            <p className="mt-1 max-w-lg text-sm opacity-80">
              Can&apos;t find the perfect fit? Mix and match from our entire
              catalogue to build a gift box that&apos;s uniquely yours.
            </p>
          </div>
          <Link
            href="/build-your-gift-box"
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-95"
          >
            Build Your Gift Box
          </Link>
        </div>
      </section>
    </>
  );
}
