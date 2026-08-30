import { createAdminClient } from "@/lib/supabase/server";
import { createDiscount, deleteDiscount, updateDiscount } from "@/lib/actions/discounts";
import { DiscountForm } from "@/components/admin/DiscountForm";
import type { Category, Discount } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = createAdminClient();
  const [{ data: categories }, { data: discounts }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("discounts").select("*").order("created_at", { ascending: false }),
  ]);
  return {
    categories: (categories ?? []) as Category[],
    discounts: (discounts ?? []) as Discount[],
  };
}

export default async function DiscountsAdminPage() {
  const { categories, discounts } = await getData();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Discounts</h1>
        <p className="mt-1 text-sm text-muted">
          Only one discount should be active at a time — the gift box applies
          the first active all-products discount, or a category-specific one.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Add Discount</h2>
        <DiscountForm
          action={async (formData) => {
            "use server";
            await createDiscount(formData);
          }}
          categories={categories}
        />
      </div>

      <div className="space-y-4">
        {discounts.map((discount) => (
          <details key={discount.id} className="rounded-2xl border border-border bg-card p-5">
            <summary className="cursor-pointer text-sm font-medium">
              {discount.name}
              {discount.is_active && (
                <span className="ml-2 text-xs text-accent">(active)</span>
              )}
            </summary>
            <div className="mt-4 space-y-4">
              <DiscountForm
                categories={categories}
                discount={discount}
                action={async (formData) => {
                  "use server";
                  await updateDiscount(discount.id, formData);
                }}
              />
              <form
                action={async () => {
                  "use server";
                  await deleteDiscount(discount.id);
                }}
              >
                <button className="text-sm text-red-600 underline">Delete Discount</button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
