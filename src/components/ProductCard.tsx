"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";
import { useGiftBox } from "@/lib/giftbox-context";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useGiftBox();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: product.price,
      showPrice: product.show_price,
      categoryId: product.categories?.[0]?.id ?? null,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-border">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-medium leading-snug">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        )}
        <div className="mt-2 flex flex-1 items-end justify-between gap-3">
          {product.show_price && product.price != null ? (
            <span className="font-display text-lg tabular-nums">₹{product.price}</span>
          ) : (
            <span />
          )}
          <button
            onClick={handleAdd}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:brightness-95 active:scale-95"
          >
            {justAdded && <Check className="h-4 w-4" />}
            {justAdded ? "Added" : "Add to Gift Box"}
          </button>
        </div>
      </div>
    </div>
  );
}
