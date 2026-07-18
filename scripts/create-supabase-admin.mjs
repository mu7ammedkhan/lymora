import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.LYMORA_ADMIN_EMAIL;
const password = process.env.LYMORA_ADMIN_PASSWORD;

if (!url || !secretKey || !email || !password) {
  throw new Error("Supabase URL, secret key, admin email and admin password are required in .env.local");
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket },
});
const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Lymora Administrator" },
});

if (error) throw error;
const { error: profileError } = await supabase
  .from("profiles")
  .update({ role: "super_admin" })
  .eq("id", data.user.id);
if (profileError) throw profileError;
console.log(`Created Supabase administrator ${data.user.email}`);
