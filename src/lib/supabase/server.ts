import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Session-aware server client (publishable key + request cookies).
 * Use for auth checks (auth.getUser()) and for public-facing reads
 * server-side, where RLS's public-read policies already apply.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component with no writable
            // response — safe to ignore because middleware refreshes
            // the session on every request.
          }
        },
      },
    },
  );
}

/**
 * Admin/service client (secret key, no session). Bypasses RLS entirely —
 * only ever call this from Server Actions / route handlers, after an
 * explicit admin-session check. Never import into client components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
