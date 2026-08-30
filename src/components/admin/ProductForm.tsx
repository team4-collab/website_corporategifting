import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  action,
  product,
  categories,
}: {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  categories: Category[];
}) {
  const selectedCategoryIds = new Set(product?.categories?.map((c) => c.id) ?? []);

  return (
    <form action={action} className="space-y-3">
      <input
        required
        name="name"
        placeholder="Product name"
        defaultValue={product?.name}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder="Short description"
        defaultValue={product?.description ?? ""}
        rows={2}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
      <ImageUploader name="image_url" defaultValue={product?.image_url} />

      <div className="flex flex-wrap gap-4">
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price (optional)"
          defaultValue={product?.price ?? ""}
          className="w-40 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <input
          type="number"
          name="sort_order"
          placeholder="Sort order"
          defaultValue={product?.sort_order ?? 0}
          className="w-32 rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="show_price"
          defaultChecked={product?.show_price ?? true}
        />
        Show price to customers
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product?.is_active ?? true}
        />
        Active (visible on the site)
      </label>

      <div>
        <p className="mb-1 text-sm font-medium">Categories</p>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="category_ids"
                value={category.id}
                defaultChecked={selectedCategoryIds.has(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        {product ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}
