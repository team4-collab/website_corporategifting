import { createAdminClient } from "@/lib/supabase/server";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";
import type { Enquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getEnquiries(): Promise<Enquiry[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function EnquiriesAdminPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Enquiries</h1>
        <p className="mt-1 text-sm text-muted">
          Gift-box enquiries submitted from the site, newest first.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <p className="text-muted">No enquiries yet.</p>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {enquiry.name}
                    {enquiry.company_name && (
                      <span className="text-muted"> · {enquiry.company_name}</span>
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    {enquiry.email} · {enquiry.phone}
                    {enquiry.delivery_city && ` · ${enquiry.delivery_city}`}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(enquiry.created_at).toLocaleString()}
                  </p>
                </div>

                <EnquiryStatusSelect enquiryId={enquiry.id} status={enquiry.status} />
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {enquiry.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                    {item.price != null && ` — ₹${item.price * item.quantity}`}
                  </li>
                ))}
              </ul>

              {enquiry.message && (
                <p className="mt-3 text-sm text-muted">&ldquo;{enquiry.message}&rdquo;</p>
              )}

              {enquiry.total != null && (
                <p className="mt-3 text-sm font-medium">Total: ₹{enquiry.total}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
