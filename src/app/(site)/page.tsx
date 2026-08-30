import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryCard } from "@/components/CategoryCard";
import { FestiveBanner } from "@/components/FestiveBanner";
import { ImageMarquee } from "@/components/ImageMarquee";
import type { Category, SiteSettings } from "@/lib/types";

async function getHomepageData() {
  const supabase = await createClient();
  const [{ data: categories }, { data: settings }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("products")
      .select("id, name, image_url")
      .eq("is_active", true)
      .not("image_url", "is", null)
      .order("sort_order")
      .limit(10),
  ]);
  return {
    categories: (categories ?? []) as Category[],
    settings: settings as SiteSettings | null,
    marqueeImages: (products ?? [])
      .filter((p) => p.image_url)
      .map((p) => ({ url: p.image_url as string, alt: p.name })),
  };
}

export default async function HomePage() {
  const { categories, settings, marqueeImages } = await getHomepageData();

  return (
    <>
      <FestiveBanner settings={settings} />

      <section className="relative overflow-hidden bg-[radial-gradient(120%_100%_at_50%_-10%,var(--accent-soft)_0%,var(--background)_62%)]">
        {settings?.hero_banner_url && (
          <Image
            src={settings.hero_banner_url}
            alt=""
            fill
            className="object-cover opacity-10"
          />
        )}

        {marqueeImages.length > 0 && (
          <div className="relative pt-10 sm:pt-12">
            <ImageMarquee images={marqueeImages} />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 text-center sm:pb-20">
          <h1 className="text-balance font-display text-4xl font-medium sm:text-6xl">
            Premium Corporate Gifting, Made Simple
          </h1>
          {settings?.hero_tagline && (
            <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
              {settings.hero_tagline}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <h2 className="mb-6 font-display text-2xl font-medium sm:text-3xl">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[linear-gradient(135deg,var(--foreground)_0%,#33302a_100%)] px-8 py-10 text-center text-background sm:flex-row sm:gap-4 sm:text-left sm:px-10">
          <div>
            <h2 className="font-display text-2xl font-medium sm:text-3xl">
              Build Your Gift Box
            </h2>
            <p className="mt-2 max-w-lg text-sm text-background/75">
              Can&apos;t find the perfect fit? Mix and match from our entire
              catalogue to build a gift box that&apos;s uniquely yours.
            </p>
          </div>
          <Link
            href="/build-your-gift-box"
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:-translate-y-0.5 hover:shadow-lg hover:brightness-105"
          >
            Build Your Gift Box
          </Link>
        </div>
      </section>
    </>
  );
}
