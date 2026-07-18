const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = () => process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = () => process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && publishableKey() && secretKey());
}

export function wantsSupabase() {
  return process.env.LYMORA_DATA_PROVIDER === "supabase" || isSupabaseConfigured();
}

export function getSupabasePublicConfig() {
  const url = supabaseUrl();
  const key = publishableKey();
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required");
  return { url, key };
}

export function getSupabaseAdminConfig() {
  const { url } = getSupabasePublicConfig();
  const key = secretKey();
  if (!key) throw new Error("SUPABASE_SECRET_KEY is required on the server");
  return { url, key };
}

export function assertSupabaseConfiguration() {
  if (process.env.LYMORA_DATA_PROVIDER === "supabase" && !isSupabaseConfigured()) {
    throw new Error("LYMORA_DATA_PROVIDER is set to supabase, but the Supabase environment variables are incomplete");
  }
}
