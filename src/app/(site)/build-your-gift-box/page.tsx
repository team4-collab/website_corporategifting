import { createClient } from "@/lib/supabase/server";
import { GiftBoxBuilder } from "@/components/GiftBoxBuilder";
import type { Category, Product } from "@/lib/types";

async function getBuilderData() {
  const supabase = await createClient();

  const [{ data: categories }, { data: rawProducts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*, product_categories(category:categories(*))")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const products: Product[] = (rawProducts ?? []).map((p) => ({
    ...p,
    categories: (p.product_categories ?? [])
      .map((pc: { category: Category }) => pc.category)
      .filter(Boolean),
  }));

  return {
    categories: (categories ?? []) as Category[],
    products,
  };
}

export default async function BuildYourGiftBoxPage() {
  const { categories, products } = await getBuilderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <h1 className="font-display text-3xl font-medium sm:text-5xl">Build Your Gift Box</h1>
      <p className="mt-3 max-w-xl text-muted">
        Mix and match from our entire catalogue to build a gift box that&apos;s
        uniquely yours.
      </p>

      <GiftBoxBuilder categories={categories} products={products} />
    </div>
  );
}
