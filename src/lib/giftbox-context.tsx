"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { GiftBoxItem } from "@/lib/types";

const STORAGE_KEY = "giftbox-items";

type AddableProduct = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  showPrice: boolean;
  categoryId: string | null;
};

type GiftBoxContextValue = {
  items: GiftBoxItem[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: AddableProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const GiftBoxContext = createContext<GiftBoxContextValue | null>(null);

export function GiftBoxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<GiftBoxItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount, intentionally deferred
    // past the first render so the server-rendered (empty) markup matches
    // the client's initial hydration pass.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: AddableProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.productId,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          price: product.price,
          showPrice: product.showPrice,
          categoryId: product.categoryId,
          quantity,
        },
      ];
    });
    setDrawerOpen(false);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + (i.showPrice && i.price ? i.price * i.quantity : 0),
        0,
      ),
    [items],
  );

  const value: GiftBoxContextValue = {
    items,
    itemCount,
    subtotal,
    isDrawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };

  return (
    <GiftBoxContext.Provider value={value}>{children}</GiftBoxContext.Provider>
  );
}

export function useGiftBox() {
  const ctx = useContext(GiftBoxContext);
  if (!ctx) throw new Error("useGiftBox must be used within GiftBoxProvider");
  return ctx;
}
