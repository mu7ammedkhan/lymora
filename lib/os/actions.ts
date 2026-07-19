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
import { getAssessmentSummary } from "@/lib/os/academy";

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

export async function createCohortSessionAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({
    cohortId: z.string().uuid(), moduleId: z.string().uuid().optional(), title: z.string().min(3).max(160),
    startsAt: z.string().min(10), endsAt: z.string().min(10), deliveryMode: z.enum(["live_online", "in_person", "hybrid"]),
    joinUrl: z.union([z.literal(""), z.string().url()]),
  }).safeParse({ ...Object.fromEntries(formData), moduleId: formData.get("moduleId") || undefined });
  if (!parsed.success) return;
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (!Number.isFinite(startsAt.getTime()) || endsAt <= startsAt) return;
  const sessionId = randomUUID();
  await updateDatabase((database) => {
    const cohort = database.cohorts.find((item) => item.id === parsed.data.cohortId);
    if (!cohort) return;
    if (parsed.data.moduleId && !database.cohortModules.some((item) => item.cohortId === cohort.id && item.moduleId === parsed.data.moduleId)) return;
    const now = new Date().toISOString();
    database.cohortSessions.push({
      id: sessionId, cohortId: cohort.id, moduleId: parsed.data.moduleId ?? null, title: parsed.data.title,
      startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), deliveryMode: parsed.data.deliveryMode,
      joinUrl: parsed.data.joinUrl, status: "scheduled", createdBy: user.id, createdAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "session.created", entityType: "session", entityId: sessionId, detail: `Scheduled ${parsed.data.title} for ${cohort.code}`, createdAt: now });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/delivery`);
}

export async function updateCohortModuleStatusAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({ cohortId: z.string().uuid(), cohortModuleId: z.string().uuid(), status: z.enum(["locked", "open", "completed"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const cohortModule = database.cohortModules.find((item) => item.id === parsed.data.cohortModuleId && item.cohortId === parsed.data.cohortId);
    if (!cohortModule) return;
    cohortModule.status = parsed.data.status;
    const module = database.learningModules.find((item) => item.id === cohortModule.moduleId);
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "module.status_changed", entityType: "session", entityId: cohortModule.id, detail: `${module?.title ?? "Module"} is now ${cohortModule.status}`, createdAt: new Date().toISOString() });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/delivery`);
  revalidatePath("/app/learning");
}

export async function updateSessionStatusAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({ cohortId: z.string().uuid(), sessionId: z.string().uuid(), status: z.enum(["scheduled", "live", "completed", "cancelled"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const session = database.cohortSessions.find((item) => item.id === parsed.data.sessionId && item.cohortId === parsed.data.cohortId);
    if (!session) return;
    session.status = parsed.data.status;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "session.status_changed", entityType: "session", entityId: session.id, detail: `Changed ${session.title} to ${session.status}`, createdAt: new Date().toISOString() });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/delivery`);
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/delivery/${parsed.data.sessionId}`);
}

export async function markAttendanceAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({
    cohortId: z.string().uuid(), sessionId: z.string().uuid(), enrollmentId: z.string().uuid(),
    status: z.enum(["present", "late", "excused", "absent"]), minutesAttended: z.coerce.number().int().min(0).max(1440), notes: z.string().max(1000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const session = database.cohortSessions.find((item) => item.id === parsed.data.sessionId && item.cohortId === parsed.data.cohortId);
    const enrollment = database.enrollments.find((item) => item.id === parsed.data.enrollmentId && item.cohortId === parsed.data.cohortId);
    if (!session || !enrollment) return;
    const sessionMinutes = Math.ceil((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / 60_000);
    if (parsed.data.minutesAttended > sessionMinutes) return;
    if (["absent", "excused"].includes(parsed.data.status) && parsed.data.minutesAttended !== 0) return;
    const now = new Date().toISOString();
    const record = database.attendanceRecords.find((item) => item.sessionId === session.id && item.enrollmentId === enrollment.id);
    if (record) Object.assign(record, { status: parsed.data.status, minutesAttended: parsed.data.minutesAttended, notes: parsed.data.notes ?? "", markedBy: user.id, markedAt: now });
    else database.attendanceRecords.push({ id: randomUUID(), sessionId: session.id, enrollmentId: enrollment.id, status: parsed.data.status, minutesAttended: parsed.data.minutesAttended, notes: parsed.data.notes ?? "", markedBy: user.id, markedAt: now });
    const application = database.applications.find((item) => item.id === enrollment.applicationId);
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "attendance.marked", entityType: "session", entityId: session.id, detail: `Marked ${application?.fullName ?? "learner"} ${parsed.data.status} for ${session.title}`, createdAt: now });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/delivery/${parsed.data.sessionId}`);
}

export async function submitAssessmentEvidenceAction(formData: FormData) {
  const user = await requireRole(["candidate"]);
  const parsed = z.object({ componentId: z.string().uuid(), evidenceUrl: z.string().url().max(1000), submissionNotes: z.string().min(10).max(3000) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success || !user.applicationId) return;
  await updateDatabase((database) => {
    const enrollment = database.enrollments.find((item) => item.applicationId === user.applicationId && ["enrolled", "active"].includes(item.status));
    const component = database.assessmentComponents.find((item) => item.id === parsed.data.componentId);
    const cohort = database.cohorts.find((item) => item.id === enrollment?.cohortId);
    if (!enrollment || !cohort || !component || component.programCode !== cohort.code.split("-")[0]) return;
    const now = new Date().toISOString();
    const submission = database.assessmentSubmissions.find((item) => item.enrollmentId === enrollment.id && item.componentId === component.id);
    if (submission) Object.assign(submission, { status: "submitted" as const, evidenceUrl: parsed.data.evidenceUrl, submissionNotes: parsed.data.submissionNotes, submittedAt: now, updatedAt: now });
    else database.assessmentSubmissions.push({ id: randomUUID(), enrollmentId: enrollment.id, componentId: component.id, status: "submitted", evidenceUrl: parsed.data.evidenceUrl, submissionNotes: parsed.data.submissionNotes, submittedAt: now, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "assessment.submitted", entityType: "assessment", entityId: component.id, detail: `Submitted evidence for ${component.title}`, createdAt: now });
  });
  revalidatePath("/app/learning");
}

export async function gradeAssessmentAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops", "assessor"]);
  const parsed = z.object({
    cohortId: z.string().uuid(), enrollmentId: z.string().uuid(), componentId: z.string().uuid(), score: z.coerce.number().min(0).max(100),
    outcome: z.enum(["pass", "resubmit", "fail"]), feedback: z.string().min(5).max(4000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const enrollment = database.enrollments.find((item) => item.id === parsed.data.enrollmentId && item.cohortId === parsed.data.cohortId);
    const component = database.assessmentComponents.find((item) => item.id === parsed.data.componentId);
    const cohort = database.cohorts.find((item) => item.id === enrollment?.cohortId);
    if (!enrollment || !cohort || !component || component.programCode !== cohort.code.split("-")[0]) return;
    const now = new Date().toISOString();
    let submission = database.assessmentSubmissions.find((item) => item.enrollmentId === enrollment.id && item.componentId === component.id);
    if (!submission) {
      submission = { id: randomUUID(), enrollmentId: enrollment.id, componentId: component.id, status: "under_review", evidenceUrl: "", submissionNotes: "Recorded by assessor", submittedAt: now, createdAt: now, updatedAt: now };
      database.assessmentSubmissions.push(submission);
    }
    submission.status = parsed.data.outcome === "pass" && parsed.data.score >= component.passThreshold ? "accepted" : "revision_requested";
    submission.updatedAt = now;
    const result = database.assessmentResults.find((item) => item.submissionId === submission.id);
    if (result) Object.assign(result, { score: parsed.data.score, outcome: parsed.data.outcome, feedback: parsed.data.feedback, gradedBy: user.id, gradedAt: now });
    else database.assessmentResults.push({ id: randomUUID(), submissionId: submission.id, score: parsed.data.score, outcome: parsed.data.outcome, feedback: parsed.data.feedback, gradedBy: user.id, gradedAt: now });
    const application = database.applications.find((item) => item.id === enrollment.applicationId);
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "assessment.graded", entityType: "assessment", entityId: submission.id, detail: `Graded ${component.title} for ${application?.fullName ?? "learner"}: ${parsed.data.score}%`, createdAt: now });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/assessment`);
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/assessment/${parsed.data.enrollmentId}`);
}

export async function issueCredentialAction(formData: FormData) {
  const user = await requireRole(["super_admin", "academy_ops"]);
  const parsed = z.object({ cohortId: z.string().uuid(), enrollmentId: z.string().uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    if (database.credentials.some((item) => item.enrollmentId === parsed.data.enrollmentId)) return;
    const enrollment = database.enrollments.find((item) => item.id === parsed.data.enrollmentId && item.cohortId === parsed.data.cohortId);
    if (!enrollment) return;
    const summary = getAssessmentSummary(database, enrollment.id);
    if (!summary.certificationReady) return;
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt);
    expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 2);
    const credentialNumber = `LYM-CAIO-${issuedAt.getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    database.credentials.push({
      id: randomUUID(), enrollmentId: enrollment.id, credentialNumber, status: "issued", overallScore: summary.overallScore,
      classification: summary.classification, issuedAt: issuedAt.toISOString(), expiresAt: expiresAt.toISOString(),
      verificationCode: randomUUID().replaceAll("-", "").slice(0, 24), issuedBy: user.id, createdAt: issuedAt.toISOString(),
    });
    enrollment.status = "completed";
    enrollment.progress = 100;
    const application = database.applications.find((item) => item.id === enrollment.applicationId);
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "credential.issued", entityType: "credential", entityId: enrollment.id, detail: `Issued ${credentialNumber} to ${application?.fullName ?? "learner"}`, createdAt: issuedAt.toISOString() });
  });
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/assessment`);
  revalidatePath(`/app/cohorts/${parsed.data.cohortId}/assessment/${parsed.data.enrollmentId}`);
  revalidatePath("/app/learning");
}
