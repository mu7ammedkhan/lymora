"use server";

import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/os/auth";
import { updateDatabase } from "@/lib/os/store";
import { applicationStatuses } from "@/lib/os/types";
import { createSupabaseTeamMember, setSupabaseUserStatus } from "@/lib/os/supabase-store";
import { wantsSupabase } from "@/lib/supabase/config";

const staffRoles = ["super_admin", "academy_ops", "assessor"] as const;

export async function updateApplicationAction(formData: FormData) {
  const user = await requireRole([...staffRoles]);
  const schema = z.object({
    applicationId: z.string().min(1),
    status: z.enum(applicationStatuses),
    score: z.coerce.number().min(0).max(100).optional(),
    notes: z.string().max(4000).optional(),
  });
  const parsed = schema.safeParse({
    applicationId: formData.get("applicationId"),
    status: formData.get("status"),
    score: formData.get("score") || undefined,
    notes: formData.get("notes") || "",
  });
  if (!parsed.success) return;

  await updateDatabase((database) => {
    const application = database.applications.find((item) => item.id === parsed.data.applicationId);
    if (!application) return;
    const previousStatus = application.status;
    application.status = parsed.data.status;
    application.score = parsed.data.score ?? null;
    application.notes = parsed.data.notes ?? "";
    application.reviewedBy = user.id;
    application.updatedAt = new Date().toISOString();
    database.activities.unshift({
      id: randomUUID(), actorId: user.id, action: "application.updated", entityType: "application", entityId: application.id,
      detail: previousStatus === application.status ? `Updated ${application.fullName}'s review` : `Moved ${application.fullName} from ${previousStatus} to ${application.status}`,
      createdAt: new Date().toISOString(),
    });
  });
  revalidatePath("/app");
  revalidatePath("/app/admissions");
  revalidatePath(`/app/admissions/${parsed.data.applicationId}`);
}

export async function createManualApplicationAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const schema = z.object({
    fullName: z.string().min(2), email: z.string().email(), phone: z.string().min(5), location: z.string().min(2),
    currentRole: z.string().min(2), industry: z.string().min(2), track: z.string().min(2), notes: z.string().max(4000).optional(),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/app/admissions/new?error=invalid");
  const id = randomUUID();
  await updateDatabase((database) => {
    const sequence = Math.max(26080, ...database.applications.map((item) => Number(item.number.replace(/\D/g, "")) || 0)) + 1;
    const now = new Date().toISOString();
    database.applications.unshift({
      id, number: `CAIO-${sequence}`, fullName: parsed.data.fullName, email: parsed.data.email.toLowerCase(), phone: parsed.data.phone,
      location: parsed.data.location, currentRole: parsed.data.currentRole, industry: parsed.data.industry, experience: "Not provided",
      aiLevel: "Not assessed", track: parsed.data.track, workflowGoal: "", motivation: "", scheduleCommitment: "Not confirmed",
      investmentReadiness: "Not confirmed", linkedinUrl: "", status: "new", score: null, notes: parsed.data.notes ?? "", source: "manual",
      reviewedBy: user.id, createdAt: now, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "application.created", entityType: "application", entityId: id, detail: `Added ${parsed.data.fullName} to admissions`, createdAt: now });
  });
  revalidatePath("/app");
  revalidatePath("/app/admissions");
  redirect(`/app/admissions/${id}`);
}

export async function createCohortAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const schema = z.object({
    code: z.string().min(2).max(20), name: z.string().min(3), startDate: z.string().min(8), endDate: z.string().min(8),
    schedule: z.string().min(3), capacity: z.coerce.number().int().min(1).max(500),
  });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const id = randomUUID();
  await updateDatabase((database) => {
    const now = new Date().toISOString();
    database.cohorts.push({ id, code: parsed.data.code.toUpperCase(), name: parsed.data.name, program: "Certified AI Operations Professional", startDate: parsed.data.startDate, endDate: parsed.data.endDate, schedule: parsed.data.schedule, capacity: parsed.data.capacity, status: "draft", createdAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "cohort.created", entityType: "cohort", entityId: id, detail: `Created ${parsed.data.name}`, createdAt: now });
  });
  revalidatePath("/app/cohorts");
  redirect(`/app/cohorts/${id}`);
}

export async function updateCohortStatusAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({ cohortId: z.string(), status: z.enum(["draft", "enrolling", "active", "completed"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const cohort = database.cohorts.find((item) => item.id === parsed.data.cohortId);
    if (!cohort) return;
    cohort.status = parsed.data.status;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "cohort.updated", entityType: "cohort", entityId: cohort.id, detail: `Changed ${cohort.code} to ${cohort.status}`, createdAt: new Date().toISOString() });
  });
  revalidatePath("/app");
  revalidatePath("/app/cohorts");
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}`);
}

export async function enrolApplicationAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({ cohortId: z.string(), applicationId: z.string() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    if (database.enrollments.some((item) => item.cohortId === parsed.data.cohortId && item.applicationId === parsed.data.applicationId)) return;
    const cohort = database.cohorts.find((item) => item.id === parsed.data.cohortId);
    const application = database.applications.find((item) => item.id === parsed.data.applicationId);
    if (!cohort || !application) return;
    const now = new Date().toISOString();
    database.enrollments.push({ id: randomUUID(), cohortId: cohort.id, applicationId: application.id, status: "invited", progress: 0, createdAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "enrollment.created", entityType: "enrollment", entityId: application.id, detail: `Invited ${application.fullName} to ${cohort.code}`, createdAt: now });
  });
  revalidatePath("/app");
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}`);
}

export async function createTeamMemberAction(formData: FormData) {
  const actor = await requireRole(["super_admin"]);
  const parsed = z.object({
    name: z.string().min(2), email: z.string().email(), role: z.enum(["super_admin", "academy_ops", "assessor", "candidate"]),
    password: z.string().min(10),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  if (wantsSupabase()) {
    await createSupabaseTeamMember(parsed.data, actor.id);
    revalidatePath("/app/team");
    revalidatePath("/app/activity");
    return;
  }
  await updateDatabase(async (database) => {
    if (database.users.some((item) => item.email.toLowerCase() === parsed.data.email.toLowerCase())) return;
    const now = new Date().toISOString();
    const id = randomUUID();
    database.users.push({ id, name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash: await hash(parsed.data.password, 12), role: parsed.data.role, status: "active", lastLoginAt: null, createdAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: actor.id, action: "user.created", entityType: "user", entityId: id, detail: `Created access for ${parsed.data.name}`, createdAt: now });
  });
  revalidatePath("/app/team");
  revalidatePath("/app/activity");
}

export async function changeUserStatusAction(formData: FormData) {
  const actor = await requireRole(["super_admin"]);
  const parsed = z.object({ userId: z.string(), status: z.enum(["active", "disabled"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success || parsed.data.userId === actor.id) return;
  if (wantsSupabase()) {
    await setSupabaseUserStatus(parsed.data.userId, parsed.data.status, actor.id);
    revalidatePath("/app/team");
    revalidatePath("/app/activity");
    return;
  }
  await updateDatabase((database) => {
    const user = database.users.find((item) => item.id === parsed.data.userId);
    if (!user) return;
    user.status = parsed.data.status;
    if (user.status === "disabled") database.sessions = database.sessions.filter((session) => session.userId !== user.id);
    database.activities.unshift({ id: randomUUID(), actorId: actor.id, action: "user.status_changed", entityType: "user", entityId: user.id, detail: `${user.status === "active" ? "Enabled" : "Disabled"} access for ${user.name}`, createdAt: new Date().toISOString() });
  });
  revalidatePath("/app/team");
}
