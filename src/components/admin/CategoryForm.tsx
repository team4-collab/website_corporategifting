import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/types";

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
}) {
  return (
    <form action={action} className="space-y-3">
      <input
        required
        name="name"
        placeholder="Category name"
        defaultValue={category?.name}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder="Short description"
        defaultValue={category?.description ?? ""}
        rows={2}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />
      <ImageUploader name="image_url" defaultValue={category?.image_url} />
      <input
        type="number"
        name="sort_order"
        placeholder="Sort order"
        defaultValue={category?.sort_order ?? 0}
        className="w-32 rounded-lg border border-border px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        {category ? "Save Changes" : "Add Category"}
      </button>
    </form>
  );
}
