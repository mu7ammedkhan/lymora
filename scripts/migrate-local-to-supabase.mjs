import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secretKey) throw new Error("Supabase URL and secret key are required in .env.local");

const localPath = path.join(process.cwd(), "data", "lymora-os.json");
const local = JSON.parse(await readFile(localPath, "utf8"));
const supabase = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false } });

const applicationRows = local.applications.map((item) => ({
  id: randomUUID(), application_number: item.number, full_name: item.fullName, email: item.email, phone: item.phone, location: item.location,
  current_role: item.currentRole, industry: item.industry, experience: item.experience, ai_level: item.aiLevel, track: item.track,
  workflow_goal: item.workflowGoal, motivation: item.motivation, schedule_commitment: item.scheduleCommitment,
  investment_readiness: item.investmentReadiness, linkedin_url: item.linkedinUrl, status: item.status, score: item.score,
  notes: item.notes, source: item.source, reviewed_by: null, created_at: item.createdAt, updated_at: item.updatedAt,
}));
const { data: applications, error: applicationError } = await supabase.from("applications").upsert(applicationRows, { onConflict: "application_number" }).select("id, application_number");
if (applicationError) throw applicationError;
const applicationIds = new Map(applications.map((item) => [item.application_number, item.id]));
const localApplicationNumbers = new Map(local.applications.map((item) => [item.id, item.number]));

const cohortRows = local.cohorts.map((item) => ({
  id: randomUUID(), code: item.code, name: item.name, program: item.program, start_date: item.startDate, end_date: item.endDate,
  schedule: item.schedule, capacity: item.capacity, status: item.status, created_at: item.createdAt,
}));
const { data: cohorts, error: cohortError } = await supabase.from("cohorts").upsert(cohortRows, { onConflict: "code" }).select("id, code");
if (cohortError) throw cohortError;
const cohortIds = new Map(cohorts.map((item) => [item.code, item.id]));
const localCohortCodes = new Map(local.cohorts.map((item) => [item.id, item.code]));

const enrollmentRows = local.enrollments.map((item) => ({
  id: randomUUID(), cohort_id: cohortIds.get(localCohortCodes.get(item.cohortId)),
  application_id: applicationIds.get(localApplicationNumbers.get(item.applicationId)), status: item.status, progress: item.progress, created_at: item.createdAt,
})).filter((item) => item.cohort_id && item.application_id);
if (enrollmentRows.length) {
  const { error } = await supabase.from("enrollments").upsert(enrollmentRows, { onConflict: "cohort_id,application_id" });
  if (error) throw error;
}

const activityRows = local.activities.slice(0, 500).map((item) => ({
  id: randomUUID(), actor_id: null, action: item.action, entity_type: item.entityType, entity_id: item.entityId, detail: item.detail, created_at: item.createdAt,
}));
if (activityRows.length) {
  const { error } = await supabase.from("activities").insert(activityRows);
  if (error) throw error;
}

console.log(`Migrated ${applications.length} applications, ${cohorts.length} cohorts and ${enrollmentRows.length} enrollments.`);
