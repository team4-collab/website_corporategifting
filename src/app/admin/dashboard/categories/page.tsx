import { createAdminClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data ?? [];
}

export default async function CategoriesAdminPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-muted">
          Manage the categories shown on the homepage grid.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Add Category</h2>
        <CategoryForm
          action={async (formData) => {
            "use server";
            await createCategory(formData);
          }}
        />
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <details key={category.id} className="rounded-2xl border border-border bg-card p-5">
            <summary className="cursor-pointer text-sm font-medium">
              {category.name} <span className="text-muted">/{category.slug}</span>
            </summary>
            <div className="mt-4 space-y-4">
              <CategoryForm action={async (formData) => {
                "use server";
                const { updateCategory } = await import("@/lib/actions/categories");
                await updateCategory(category.id, formData);
              }} category={category} />
              <form
                action={async () => {
                  "use server";
                  await deleteCategory(category.id);
                }}
              >
                <button className="text-sm text-red-600 underline">Delete Category</button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
