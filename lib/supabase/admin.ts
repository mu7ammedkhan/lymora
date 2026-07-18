import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/config";

export function createSupabaseAdminClient() {
  const { url, key } = getSupabaseAdminConfig();
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
