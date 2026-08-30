import { createClient } from "@/lib/supabase/server";

/** Guards every admin server action against direct invocation while logged out. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  return user;
}
