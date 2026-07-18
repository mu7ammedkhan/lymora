import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Activity, Application, Cohort, DatabaseSchema, Enrollment, Role, User } from "@/lib/os/types";
import type { Database } from "@/lib/supabase/database.types";

type Row = Record<string, unknown>;
type TableName = keyof Database["public"]["Tables"];

function profileToUser(row: Row): User {
  return {
    id: String(row.id),
    name: String(row.full_name),
    email: String(row.email),
    passwordHash: "supabase-managed",
    role: row.role as Role,
    status: row.status as User["status"],
    applicationId: row.application_id ? String(row.application_id) : undefined,
    lastLoginAt: row.last_login_at ? String(row.last_login_at) : null,
    createdAt: String(row.created_at),
  };
}

function rowToApplication(row: Row): Application {
  return {
    id: String(row.id), number: String(row.application_number), fullName: String(row.full_name), email: String(row.email),
    phone: String(row.phone), location: String(row.location), currentRole: String(row.current_role), industry: String(row.industry),
    experience: String(row.experience), aiLevel: String(row.ai_level), track: String(row.track), workflowGoal: String(row.workflow_goal),
    motivation: String(row.motivation), scheduleCommitment: String(row.schedule_commitment), investmentReadiness: String(row.investment_readiness),
    linkedinUrl: String(row.linkedin_url), status: row.status as Application["status"], score: row.score === null ? null : Number(row.score),
    notes: String(row.notes), source: row.source as Application["source"], reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToCohort(row: Row): Cohort {
  return {
    id: String(row.id), code: String(row.code), name: String(row.name), program: String(row.program), startDate: String(row.start_date),
    endDate: String(row.end_date), schedule: String(row.schedule), capacity: Number(row.capacity), status: row.status as Cohort["status"],
    createdAt: String(row.created_at),
  };
}

function rowToEnrollment(row: Row): Enrollment {
  return {
    id: String(row.id), cohortId: String(row.cohort_id), applicationId: String(row.application_id), status: row.status as Enrollment["status"],
    progress: Number(row.progress), createdAt: String(row.created_at),
  };
}

function rowToActivity(row: Row): Activity {
  return {
    id: String(row.id), actorId: row.actor_id ? String(row.actor_id) : null, action: String(row.action),
    entityType: row.entity_type as Activity["entityType"], entityId: String(row.entity_id), detail: String(row.detail), createdAt: String(row.created_at),
  };
}

function applicationToRow(item: Application) {
  return {
    id: item.id, application_number: item.number, full_name: item.fullName, email: item.email, phone: item.phone, location: item.location,
    current_role: item.currentRole, industry: item.industry, experience: item.experience, ai_level: item.aiLevel, track: item.track,
    workflow_goal: item.workflowGoal, motivation: item.motivation, schedule_commitment: item.scheduleCommitment,
    investment_readiness: item.investmentReadiness, linkedin_url: item.linkedinUrl, status: item.status, score: item.score, notes: item.notes,
    source: item.source, reviewed_by: item.reviewedBy, created_at: item.createdAt, updated_at: item.updatedAt,
  };
}

function cohortToRow(item: Cohort) {
  return { id: item.id, code: item.code, name: item.name, program: item.program, start_date: item.startDate, end_date: item.endDate, schedule: item.schedule, capacity: item.capacity, status: item.status, created_at: item.createdAt };
}

function enrollmentToRow(item: Enrollment) {
  return { id: item.id, cohort_id: item.cohortId, application_id: item.applicationId, status: item.status, progress: item.progress, created_at: item.createdAt };
}

function activityToRow(item: Activity) {
  return { id: item.id, actor_id: item.actorId, action: item.action, entity_type: item.entityType, entity_id: item.entityId, detail: item.detail, created_at: item.createdAt };
}

function profileToRow(item: User) {
  return { id: item.id, full_name: item.name, email: item.email, role: item.role, status: item.status, application_id: item.applicationId ?? null, last_login_at: item.lastLoginAt, created_at: item.createdAt };
}

function changedItems<T extends { id: string }>(before: T[], after: T[]) {
  const previous = new Map(before.map((item) => [item.id, JSON.stringify(item)]));
  return after.filter((item) => previous.get(item.id) !== JSON.stringify(item));
}

async function requireRows(table: string, result: { data: unknown[] | null; error: { message: string } | null }) {
  if (result.error) throw new Error(`Supabase ${table} query failed: ${result.error.message}`);
  return (result.data ?? []) as Row[];
}

export async function readSupabaseDatabase(): Promise<DatabaseSchema> {
  const client = createSupabaseAdminClient();
  const [profilesResult, applicationsResult, cohortsResult, enrollmentsResult, activitiesResult] = await Promise.all([
    client.from("profiles").select("*").order("created_at", { ascending: true }),
    client.from("applications").select("*").order("created_at", { ascending: false }),
    client.from("cohorts").select("*").order("start_date", { ascending: true }),
    client.from("enrollments").select("*").order("created_at", { ascending: true }),
    client.from("activities").select("*").order("created_at", { ascending: false }).limit(500),
  ]);
  const profiles = await requireRows("profiles", profilesResult);
  const applications = await requireRows("applications", applicationsResult);
  const cohorts = await requireRows("cohorts", cohortsResult);
  const enrollments = await requireRows("enrollments", enrollmentsResult);
  const activities = await requireRows("activities", activitiesResult);
  return {
    users: profiles.map(profileToUser), sessions: [], applications: applications.map(rowToApplication), cohorts: cohorts.map(rowToCohort),
    enrollments: enrollments.map(rowToEnrollment), activities: activities.map(rowToActivity),
  };
}

async function upsertRows(table: TableName, rows: Row[]) {
  if (rows.length === 0) return;
  const client = createSupabaseAdminClient();
  const { error } = await client.from(table).upsert(rows as never);
  if (error) throw new Error(`Supabase ${table} update failed: ${error.message}`);
}

export async function updateSupabaseDatabase<T>(operation: (data: DatabaseSchema) => T | Promise<T>): Promise<T> {
  const before = await readSupabaseDatabase();
  const after = structuredClone(before);
  const result = await operation(after);
  await upsertRows("profiles", changedItems(before.users, after.users).filter((user) => before.users.some((item) => item.id === user.id)).map(profileToRow));
  await upsertRows("applications", changedItems(before.applications, after.applications).map(applicationToRow));
  await upsertRows("cohorts", changedItems(before.cohorts, after.cohorts).map(cohortToRow));
  await upsertRows("enrollments", changedItems(before.enrollments, after.enrollments).map(enrollmentToRow));
  await upsertRows("activities", changedItems(before.activities, after.activities).map(activityToRow));
  return result;
}

export async function createSupabaseTeamMember(input: { name: string; email: string; password: string; role: Role }, actorId: string) {
  const client = createSupabaseAdminClient();
  const { data, error } = await client.auth.admin.createUser({
    email: input.email.toLowerCase(), password: input.password, email_confirm: true,
    user_metadata: { full_name: input.name },
  });
  if (error || !data.user) throw new Error(error?.message || "Supabase could not create the user");
  const { error: profileError } = await client.from("profiles").update({ role: input.role }).eq("id", data.user.id);
  if (profileError) throw new Error(profileError.message);
  const { error: activityError } = await client.from("activities").insert({
    id: randomUUID(), actor_id: actorId, action: "user.created", entity_type: "user", entity_id: data.user.id,
    detail: `Created access for ${input.name}`, created_at: new Date().toISOString(),
  });
  if (activityError) throw new Error(activityError.message);
}

export async function setSupabaseUserStatus(userId: string, status: "active" | "disabled", actorId: string) {
  const client = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await client.from("profiles").update({ status }).eq("id", userId).select("full_name").single();
  if (profileError) throw new Error(profileError.message);
  const { error: authError } = await client.auth.admin.updateUserById(userId, { ban_duration: status === "disabled" ? "876000h" : "none" });
  if (authError) throw new Error(authError.message);
  await client.from("activities").insert({
    id: randomUUID(), actor_id: actorId, action: "user.status_changed", entity_type: "user", entity_id: userId,
    detail: `${status === "active" ? "Enabled" : "Disabled"} access for ${profile.full_name}`, created_at: new Date().toISOString(),
  });
}
