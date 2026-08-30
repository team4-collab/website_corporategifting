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
      <div className="relative overflow-hidden bg-card">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt=""
            fill
            className="object-cover opacity-25"
          />
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          {category.description && (
            <p className="mt-1 max-w-xl text-muted">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {products.length === 0 ? (
          <p className="text-muted">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
