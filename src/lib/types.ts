export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  show_price: boolean;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  categories?: Category[];
};

export type DiscountType = "percentage" | "flat";
export type DiscountAppliesTo = "all" | "category";

export type Discount = {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  applies_to: DiscountAppliesTo;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  hero_tagline: string | null;
  hero_banner_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp_number: string | null;
  whatsapp_message_template: string | null;
  social_links: Record<string, string> | null;
  festive_banner_enabled: boolean;
  festive_banner_message: string | null;
  festive_banner_end_at: string | null;
};

export type MediaItem = {
  id: string;
  storage_path: string;
  url: string;
  filename: string;
  created_at: string;
};

export type EnquiryStatus = "new" | "contacted" | "closed";

export type EnquiryItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number | null;
};

export type Enquiry = {
  id: string;
  name: string;
  company_name: string | null;
  email: string;
  phone: string;
  delivery_city: string | null;
  message: string | null;
  items: EnquiryItem[];
  subtotal: number | null;
  discount_applied: { name: string; amount: number } | null;
  total: number | null;
  status: EnquiryStatus;
  created_at: string;
};

export type GiftBoxItem = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  showPrice: boolean;
  categoryId: string | null;
  quantity: number;
};
