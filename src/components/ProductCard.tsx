"use client";

import Image from "next/image";
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square w-full bg-border">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex flex-1 items-end justify-between gap-2">
          {product.show_price && product.price != null ? (
            <span className="font-medium">₹{product.price}</span>
          ) : (
            <span />
          )}
          <button
            onClick={handleAdd}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:brightness-95"
          >
            {justAdded ? "Added ✓" : "Add to Gift Box"}
          </button>
        </div>
      </div>
    </div>
  );
}
