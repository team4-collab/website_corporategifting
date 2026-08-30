import { createAdminClient } from "@/lib/supabase/server";
import { createProduct, deleteProduct, updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: rawProducts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*, product_categories(category:categories(*))")
      .order("sort_order"),
  ]);

  const products: Product[] = (rawProducts ?? []).map((p) => ({
    ...p,
    categories: (p.product_categories ?? [])
      .map((pc: { category: Category }) => pc.category)
      .filter(Boolean),
  }));

  return { categories: (categories ?? []) as Category[], products };
}

export default async function ProductsAdminPage() {
  const { categories, products } = await getData();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-muted">
          Add products, tag them by category, and control price visibility.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Add Product</h2>
        <ProductForm
          action={async (formData) => {
            "use server";
            await createProduct(formData);
          }}
          categories={categories}
        />
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <details key={product.id} className="rounded-2xl border border-border bg-card p-5">
            <summary className="cursor-pointer text-sm font-medium">
              {product.name}
              {!product.is_active && (
                <span className="ml-2 text-xs text-muted">(inactive)</span>
              )}
            </summary>
            <div className="mt-4 space-y-4">
              <ProductForm
                categories={categories}
                product={product}
                action={async (formData) => {
                  "use server";
                  await updateProduct(product.id, formData);
                }}
              />
              <form
                action={async () => {
                  "use server";
                  await deleteProduct(product.id);
                }}
              >
                <button className="text-sm text-red-600 underline">Delete Product</button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
