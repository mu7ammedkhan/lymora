import { createHash, randomBytes, randomUUID } from "node:crypto";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDatabase, updateDatabase } from "@/lib/os/store";
import type { Role, SafeUser } from "@/lib/os/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertSupabaseConfiguration, wantsSupabase } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sessionCookie = "lymora_session";
const sessionDuration = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function authenticate(email: string, password: string): Promise<SafeUser | null> {
  assertSupabaseConfiguration();
  if (wantsSupabase()) {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !authData.user) return null;
    const admin = createSupabaseAdminClient();
    const { data: profile, error: profileError } = await admin.from("profiles").select("*").eq("id", authData.user.id).single();
    if (profileError || !profile || profile.status !== "active") {
      await supabase.auth.signOut();
      return null;
    }
    const now = new Date().toISOString();
    await admin.from("profiles").update({ last_login_at: now }).eq("id", profile.id);
    await admin.from("activities").insert({ id: randomUUID(), actor_id: profile.id, action: "session.created", entity_type: "session", entity_id: profile.id, detail: `${profile.full_name} signed in`, created_at: now });
    return {
      id: profile.id, name: profile.full_name, email: profile.email, role: profile.role as Role, status: profile.status,
      applicationId: profile.application_id ?? undefined, lastLoginAt: now, createdAt: profile.created_at,
    };
  }

  const data = await readDatabase();
  const user = data.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.status !== "active" || !(await compare(password, user.passwordHash))) return null;

  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionDuration);

  await updateDatabase((database) => {
    const target = database.users.find((candidate) => candidate.id === user.id);
    if (target) target.lastLoginAt = now.toISOString();
    database.sessions.push({ id: randomUUID(), userId: user.id, tokenHash: hashToken(token), expiresAt: expiresAt.toISOString(), createdAt: now.toISOString() });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "session.created", entityType: "session", entityId: user.id, detail: `${user.name} signed in`, createdAt: now.toISOString() });
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  assertSupabaseConfiguration();
  if (wantsSupabase()) {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error } = await supabase.auth.getUser();
    if (error || !authData.user) return null;
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", authData.user.id).single();
    if (profileError || !profile || profile.status !== "active") return null;
    return {
      id: profile.id, name: profile.full_name, email: profile.email, role: profile.role as Role, status: profile.status,
      applicationId: profile.application_id ?? undefined, lastLoginAt: profile.last_login_at, createdAt: profile.created_at,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (!token) return null;

  const data = await readDatabase();
  const session = data.sessions.find((candidate) => candidate.tokenHash === hashToken(token) && new Date(candidate.expiresAt) > new Date());
  if (!session) return null;
  const user = data.users.find((candidate) => candidate.id === session.userId && candidate.status === "active");
  if (!user) return null;
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function destroySession() {
  assertSupabaseConfiguration();
  if (wantsSupabase()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;
  if (token) {
    await updateDatabase((database) => {
      database.sessions = database.sessions.filter((session) => session.tokenHash !== hashToken(token));
    });
  }
  cookieStore.delete(sessionCookie);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowed: Role[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect("/app");
  return user;
}
