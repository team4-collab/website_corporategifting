// One-off demo content seeder — placeholder products and cover images so
// the catalogue isn't empty. Uses picsum.photos placeholder images (clearly
// not real product photography). Safe to re-run; skips products that
// already exist by slug, and always refreshes category cover images.
//
// Usage: node scripts/seed-demo.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) process.env[match[1]] ??= match[2].trim();
    }
  } catch {
    // rely on already-exported environment variables
  }
}

loadEnvLocal();

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY. Check .env.local.");
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function placeholderImage(seed, width = 800, height = 600) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PRODUCTS_BY_CATEGORY = {
  "corporate-gifting": [
    { name: "Executive Pen & Notebook Set", description: "A refined pen and notebook duo for clients and leadership gifting.", price: 45 },
    { name: "Premium Leather Portfolio", description: "Handcrafted leather portfolio with a notepad and card slots.", price: 65 },
  ],
  "festive-gifting": [
    { name: "Diwali Sweets Hamper", description: "An assortment of traditional sweets in a festive gift box.", price: 30 },
    { name: "Festive Dry Fruit Box", description: "Curated premium dry fruits in decorative festive packaging.", price: 40 },
  ],
  "edible-gifting": [
    { name: "Gourmet Chocolate Box", description: "Assorted artisan chocolates in an elegant gift box.", price: 25 },
    { name: "Artisan Coffee & Cookies Set", description: "Specialty coffee beans paired with handmade cookies.", price: 35 },
  ],
  "customizable-merchandise": [
    { name: "Branded Tote Bag", description: "Durable canvas tote bag, customizable with your company logo.", price: 15 },
    { name: "Custom Embroidered Cap", description: "Adjustable cap with embroidered branding of your choice.", price: 12 },
  ],
  "gadget-gifting": [
    { name: "Wireless Charging Pad", description: "Sleek fast-charging pad compatible with most smartphones.", price: 28 },
    { name: "Bluetooth Speaker", description: "Compact portable speaker with rich sound and long battery life.", price: 40 },
  ],
};

const { data: categories, error: categoriesError } = await supabase
  .from("categories")
  .select("id, slug");

if (categoriesError) {
  console.error("Failed to load categories:", categoriesError.message);
  process.exit(1);
}

for (const category of categories) {
  const { error } = await supabase
    .from("categories")
    .update({ image_url: placeholderImage(category.slug) })
    .eq("id", category.id);
  if (error) {
    console.error(`Failed to set image for category ${category.slug}:`, error.message);
  } else {
    console.log(`Set cover image for category: ${category.slug}`);
  }
}

for (const category of categories) {
  const products = PRODUCTS_BY_CATEGORY[category.slug] ?? [];

  for (const product of products) {
    const slug = slugify(product.name);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    let productId = existing?.id;

    if (!productId) {
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert({
          name: product.name,
          slug,
          description: product.description,
          price: product.price,
          show_price: true,
          image_url: placeholderImage(slug),
          is_active: true,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error(`Failed to insert product ${product.name}:`, insertError.message);
        continue;
      }
      productId = inserted.id;
      console.log(`Created product: ${product.name}`);
    } else {
      console.log(`Product already exists, skipping insert: ${product.name}`);
    }

    const { error: linkError } = await supabase
      .from("product_categories")
      .upsert({ product_id: productId, category_id: category.id }, { onConflict: "product_id,category_id" });

    if (linkError) {
      console.error(`Failed to link product ${product.name} to category:`, linkError.message);
    }
  }
}

console.log("Demo content seeding complete.");
