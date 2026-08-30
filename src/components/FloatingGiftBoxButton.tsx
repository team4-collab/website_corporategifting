"use client";

import { Gift } from "lucide-react";
import { useGiftBox } from "@/lib/giftbox-context";

export function FloatingGiftBoxButton() {
  const { itemCount, openDrawer } = useGiftBox();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={openDrawer}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <Gift className="h-4 w-4" />
      View My Gift Box ({itemCount})
    </button>
  );
}
