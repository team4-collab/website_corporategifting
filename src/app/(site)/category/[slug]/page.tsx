import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";

async function getCategoryData(slug: string) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*, product_categories!inner(category_id)")
    .eq("is_active", true)
    .eq("product_categories.category_id", category.id)
    .order("sort_order");

  return {
    category: category as Category,
    products: (products ?? []) as Product[],
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) notFound();

  const { category, products } = data;

  return (
    <>
      <div className="relative overflow-hidden bg-foreground">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt=""
            fill
            priority
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,12,0.9)_0%,rgba(20,17,12,0.35)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <h1 className="font-display text-3xl font-medium text-white sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-xl text-white/80">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        {products.length === 0 ? (
          <p className="text-muted">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
