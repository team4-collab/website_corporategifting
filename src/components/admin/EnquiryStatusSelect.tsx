"use client";

import { useTransition } from "react";
import { updateEnquiryStatus } from "@/lib/actions/enquiries";
import type { EnquiryStatus } from "@/lib/types";

const STATUSES: EnquiryStatus[] = ["new", "contacted", "closed"];

export function EnquiryStatusSelect({
  enquiryId,
  status,
}: {
  enquiryId: string;
  status: EnquiryStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          updateEnquiryStatus(enquiryId, e.target.value as EnquiryStatus);
        })
      }
      className="rounded-lg border border-border px-2 py-1 text-sm disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
