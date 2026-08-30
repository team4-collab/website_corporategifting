import type { Category, Discount } from "@/lib/types";

export function DiscountForm({
  action,
  discount,
  categories,
}: {
  action: (formData: FormData) => void | Promise<void>;
  discount?: Discount;
  categories: Category[];
}) {
  return (
    <form action={action} className="space-y-3">
      <input
        required
        name="name"
        placeholder="Discount name (e.g. Diwali Special)"
        defaultValue={discount?.name}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-3">
        <select
          name="type"
          defaultValue={discount?.type ?? "percentage"}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="percentage">Percentage off</option>
          <option value="flat">Flat amount off</option>
        </select>
        <input
          required
          type="number"
          step="0.01"
          name="value"
          placeholder="Value"
          defaultValue={discount?.value}
          className="w-32 rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          name="applies_to"
          defaultValue={discount?.applies_to ?? "all"}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="all">All products</option>
          <option value="category">Specific category</option>
        </select>
        <select
          name="category_id"
          defaultValue={discount?.category_id ?? ""}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">Select category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={discount?.is_active ?? false} />
        Active
      </label>

      <button
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        {discount ? "Save Changes" : "Add Discount"}
      </button>
    </form>
  );
}
