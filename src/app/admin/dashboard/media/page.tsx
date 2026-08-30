import { createAdminClient } from "@/lib/supabase/server";
import { deleteMedia, uploadMedia } from "@/lib/actions/media";
import type { MediaItem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMedia(): Promise<MediaItem[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function MediaAdminPage() {
  const media = await getMedia();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Media Library</h1>
        <p className="mt-1 text-sm text-muted">
          Upload once here, then reuse image URLs across categories, products,
          and the hero banner.
        </p>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await uploadMedia(formData);
        }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <input type="file" name="file" accept="image/*" required className="block text-sm" />
        <button
          type="submit"
          className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="space-y-2 rounded-xl border border-border bg-card p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.filename} className="aspect-square w-full rounded-lg object-cover" />
            <p className="truncate text-xs text-muted">{item.filename}</p>
            <input
              readOnly
              value={item.url}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded border border-border px-1.5 py-1 text-xs"
            />
            <form
              action={async () => {
                "use server";
                await deleteMedia(item.id, item.storage_path);
              }}
            >
              <button className="text-xs text-red-600 underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
