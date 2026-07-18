import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseAdminClient() {
  const { url, key } = getSupabaseAdminConfig();
  return createClient<Database>(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
