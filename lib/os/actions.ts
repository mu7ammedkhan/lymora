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
import { calculateProposal, calculateReadiness, corporatePackages, opportunityStages, standardProposalScope } from "@/lib/os/corporate";
import { onboardingChecklist } from "@/lib/os/workforce";
import type { CorporatePackage } from "@/lib/os/types";

const staffRoles = ["super_admin", "academy_ops", "assessor"] as const;
const corporateRoles = ["super_admin", "academy_ops"] as const;
const workforceRoles = ["super_admin", "academy_ops", "talent_ops"] as const;
const proofRoles = ["super_admin", "academy_ops", "talent_ops"] as const;

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
    name: z.string().min(2), email: z.string().email(), role: z.enum(["super_admin", "academy_ops", "talent_ops", "assessor", "candidate", "operator"]),
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

export async function createCorporateOpportunityAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({
    companyName: z.string().min(2).max(160), website: z.union([z.literal(""), z.string().url()]), industry: z.string().min(2).max(100),
    employeeBand: z.string().min(1).max(50), location: z.string().min(2).max(100), contactName: z.string().min(2).max(120),
    contactEmail: z.string().email(), contactPhone: z.string().max(40).optional(), contactTitle: z.string().max(100).optional(),
    source: z.string().min(2).max(100), title: z.string().min(3).max(180), package: z.enum(["team_enablement_15", "team_enablement_30", "private_caio", "enterprise"]),
    participantCount: z.coerce.number().int().min(1).max(10000), valueAed: z.coerce.number().min(0).max(100_000_000).optional(),
    expectedCloseDate: z.string().optional(), nextStep: z.string().min(3).max(500), nextStepDueAt: z.string().optional(), notes: z.string().max(4000).optional(),
  }).safeParse({ ...Object.fromEntries(formData), valueAed: formData.get("valueAed") || undefined });
  if (!parsed.success) return;
  const accountId = randomUUID();
  const opportunityId = randomUUID();
  const now = new Date().toISOString();
  const packagePrice = corporatePackages[parsed.data.package].price;
  const valueAed = parsed.data.package === "enterprise" ? parsed.data.valueAed ?? 0 : packagePrice;
  await updateDatabase((database) => {
    database.corporateAccounts.push({
      id: accountId, companyName: parsed.data.companyName, website: parsed.data.website, industry: parsed.data.industry,
      employeeBand: parsed.data.employeeBand, location: parsed.data.location, primaryContactName: parsed.data.contactName,
      primaryContactEmail: parsed.data.contactEmail.toLowerCase(), primaryContactPhone: parsed.data.contactPhone ?? "",
      primaryContactTitle: parsed.data.contactTitle ?? "", ownerId: user.id, source: parsed.data.source, status: "prospect",
      notes: parsed.data.notes ?? "", createdAt: now, updatedAt: now,
    });
    database.corporateOpportunities.push({
      id: opportunityId, accountId, title: parsed.data.title, package: parsed.data.package, participantCount: parsed.data.participantCount,
      stage: "lead", valueAed, probability: 10, expectedCloseDate: parsed.data.expectedCloseDate || null, nextStep: parsed.data.nextStep,
      nextStepDueAt: parsed.data.nextStepDueAt || null, ownerId: user.id, lostReason: "", createdAt: now, updatedAt: now,
    });
    database.readinessAssessments.push({
      id: randomUUID(), opportunityId, status: "draft", respondentName: "", leadershipScore: 0, peopleScore: 0, processScore: 0,
      dataScore: 0, toolsScore: 0, governanceScore: 0, adoptionScore: 0, overallScore: 0, maturity: "emerging",
      executiveSummary: "", priorities: "", risks: "", completedAt: null, createdAt: now, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "opportunity.created", entityType: "opportunity", entityId: opportunityId, detail: `Opened ${parsed.data.title} for ${parsed.data.companyName}`, createdAt: now });
  });
  revalidatePath("/app/corporate");
  redirect(`/app/corporate/${opportunityId}`);
}

export async function updateCorporateOpportunityAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({
    opportunityId: z.string().uuid(), stage: z.enum(["lead", "qualified", "diagnosis", "proposal", "proof", "won", "lost"]),
    package: z.enum(["team_enablement_15", "team_enablement_30", "private_caio", "enterprise"]), participantCount: z.coerce.number().int().min(1).max(10000),
    valueAed: z.coerce.number().min(0).max(100_000_000), probability: z.coerce.number().int().min(0).max(100),
    expectedCloseDate: z.string().optional(), nextStep: z.string().max(500).optional(), nextStepDueAt: z.string().optional(), lostReason: z.string().max(1000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const opportunity = database.corporateOpportunities.find((item) => item.id === parsed.data.opportunityId);
    if (!opportunity) return;
    const previousStage = opportunity.stage;
    Object.assign(opportunity, {
      stage: parsed.data.stage, package: parsed.data.package, participantCount: parsed.data.participantCount, valueAed: parsed.data.valueAed,
      probability: parsed.data.probability, expectedCloseDate: parsed.data.expectedCloseDate || null, nextStep: parsed.data.nextStep ?? "",
      nextStepDueAt: parsed.data.nextStepDueAt || null, lostReason: parsed.data.lostReason ?? "", updatedAt: new Date().toISOString(),
    });
    if (opportunity.stage === "won") {
      const account = database.corporateAccounts.find((item) => item.id === opportunity.accountId);
      if (account) account.status = "client";
    }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "opportunity.updated", entityType: "opportunity", entityId: opportunity.id, detail: previousStage === opportunity.stage ? `Updated ${opportunity.title}` : `Moved ${opportunity.title} from ${previousStage} to ${opportunity.stage}`, createdAt: new Date().toISOString() });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}`);
}

export async function saveReadinessAssessmentAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const score = z.coerce.number().int().min(0).max(100);
  const parsed = z.object({
    opportunityId: z.string().uuid(), assessmentId: z.string().uuid(), status: z.enum(["draft", "completed"]), respondentName: z.string().max(120).optional(),
    leadershipScore: score, peopleScore: score, processScore: score, dataScore: score, toolsScore: score, governanceScore: score, adoptionScore: score,
    executiveSummary: z.string().max(5000).optional(), priorities: z.string().max(4000).optional(), risks: z.string().max(4000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const result = calculateReadiness([parsed.data.leadershipScore, parsed.data.peopleScore, parsed.data.processScore, parsed.data.dataScore, parsed.data.toolsScore, parsed.data.governanceScore, parsed.data.adoptionScore]);
  await updateDatabase((database) => {
    const assessment = database.readinessAssessments.find((item) => item.id === parsed.data.assessmentId && item.opportunityId === parsed.data.opportunityId);
    if (!assessment) return;
    const now = new Date().toISOString();
    Object.assign(assessment, { ...parsed.data, overallScore: result.overall, maturity: result.maturity, executiveSummary: parsed.data.executiveSummary ?? "", priorities: parsed.data.priorities ?? "", risks: parsed.data.risks ?? "", completedAt: parsed.data.status === "completed" ? now : null, updatedAt: now });
    const opportunity = database.corporateOpportunities.find((item) => item.id === assessment.opportunityId);
    if (opportunity && parsed.data.status === "completed" && ["lead", "qualified"].includes(opportunity.stage)) {
      opportunity.stage = "diagnosis";
      opportunity.probability = opportunityStages.find((stage) => stage.id === "diagnosis")!.probability;
    }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "diagnostic.saved", entityType: "diagnostic", entityId: assessment.id, detail: `${parsed.data.status === "completed" ? "Completed" : "Saved"} AI readiness diagnostic at ${result.overall}%`, createdAt: now });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/diagnostic`);
}

export async function addWorkflowOpportunityAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({
    opportunityId: z.string().uuid(), assessmentId: z.string().uuid(), workflowName: z.string().min(3).max(180), department: z.string().min(2).max(100),
    currentPain: z.string().max(2000).optional(), frequency: z.string().max(100).optional(), valueScore: z.coerce.number().int().min(0).max(100),
    feasibilityScore: z.coerce.number().int().min(0).max(100), riskLevel: z.enum(["green", "amber", "red"]),
    humanOversight: z.string().max(2000).optional(), recommendation: z.string().max(2000).optional(), priority: z.coerce.number().int().min(1).max(100),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    if (!database.readinessAssessments.some((item) => item.id === parsed.data.assessmentId && item.opportunityId === parsed.data.opportunityId)) return;
    const now = new Date().toISOString();
    database.workflowOpportunities.push({ id: randomUUID(), readinessAssessmentId: parsed.data.assessmentId, workflowName: parsed.data.workflowName, department: parsed.data.department, currentPain: parsed.data.currentPain ?? "", frequency: parsed.data.frequency ?? "", valueScore: parsed.data.valueScore, feasibilityScore: parsed.data.feasibilityScore, riskLevel: parsed.data.riskLevel, humanOversight: parsed.data.humanOversight ?? "", recommendation: parsed.data.recommendation ?? "", priority: parsed.data.priority, createdAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "workflow.added", entityType: "diagnostic", entityId: parsed.data.assessmentId, detail: `Added ${parsed.data.workflowName} to the workflow register`, createdAt: now });
  });
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/diagnostic`);
}

export async function createCorporateProposalAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({
    opportunityId: z.string().uuid(), package: z.enum(["team_enablement_15", "team_enablement_30", "private_caio", "enterprise"]),
    participantCount: z.coerce.number().int().min(1).max(10000), subtotalAed: z.coerce.number().min(0).max(100_000_000),
    scope: z.string().min(20).max(10000), timeline: z.string().min(3).max(1000), assumptions: z.string().max(5000).optional(), validUntil: z.string().min(10),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const totals = calculateProposal(parsed.data.subtotalAed, 5);
  await updateDatabase((database) => {
    const opportunity = database.corporateOpportunities.find((item) => item.id === parsed.data.opportunityId);
    if (!opportunity) return;
    const now = new Date().toISOString();
    const proposalNumber = `LYM-P-${new Date().getUTCFullYear().toString().slice(-2)}${String(database.corporateProposals.length + 1).padStart(3, "0")}-${randomUUID().slice(0, 4).toUpperCase()}`;
    database.corporateProposals.push({ id: randomUUID(), opportunityId: opportunity.id, proposalNumber, package: parsed.data.package, participantCount: parsed.data.participantCount, subtotalAed: totals.subtotal, vatRate: 5, vatAed: totals.vat, totalAed: totals.total, scope: parsed.data.scope || standardProposalScope, timeline: parsed.data.timeline, assumptions: parsed.data.assumptions ?? "", status: "draft", validUntil: parsed.data.validUntil, sentAt: null, acceptedAt: null, createdBy: user.id, createdAt: now, updatedAt: now });
    opportunity.package = parsed.data.package as CorporatePackage;
    opportunity.participantCount = parsed.data.participantCount;
    opportunity.valueAed = totals.subtotal;
    opportunity.stage = "proposal";
    opportunity.probability = 65;
    opportunity.updatedAt = now;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proposal.created", entityType: "proposal", entityId: opportunity.id, detail: `Created ${proposalNumber} for ${opportunity.title}`, createdAt: now });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}`);
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/proposal`);
}

export async function updateProposalStatusAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({ opportunityId: z.string().uuid(), proposalId: z.string().uuid(), status: z.enum(["draft", "sent", "accepted", "declined", "expired"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const proposal = database.corporateProposals.find((item) => item.id === parsed.data.proposalId && item.opportunityId === parsed.data.opportunityId);
    if (!proposal) return;
    const now = new Date().toISOString();
    proposal.status = parsed.data.status;
    proposal.sentAt = parsed.data.status === "sent" && !proposal.sentAt ? now : proposal.sentAt;
    proposal.acceptedAt = parsed.data.status === "accepted" ? now : null;
    proposal.updatedAt = now;
    const opportunity = database.corporateOpportunities.find((item) => item.id === proposal.opportunityId);
    if (opportunity && parsed.data.status === "accepted") { opportunity.stage = "won"; opportunity.probability = 100; opportunity.updatedAt = now; }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proposal.status_changed", entityType: "proposal", entityId: proposal.id, detail: `Changed ${proposal.proposalNumber} to ${proposal.status}`, createdAt: now });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}`);
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/proposal`);
}

export async function scheduleCorporateWorkshopAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({
    opportunityId: z.string().uuid(), proposalId: z.string().uuid().optional(), title: z.string().min(3).max(180),
    workshopType: z.enum(["executive_readiness", "team_enablement", "manager_coaching", "workflow_lab"]), startsAt: z.string().min(10), endsAt: z.string().min(10),
    deliveryMode: z.enum(["live_online", "in_person", "hybrid"]), location: z.string().max(200).optional(), joinUrl: z.union([z.literal(""), z.string().url()]),
    facilitator: z.string().min(2).max(120), participantTarget: z.coerce.number().int().min(1).max(10000), outcomes: z.string().max(3000).optional(), notes: z.string().max(3000).optional(),
  }).safeParse({ ...Object.fromEntries(formData), proposalId: formData.get("proposalId") || undefined });
  if (!parsed.success) return;
  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(parsed.data.endsAt);
  if (!Number.isFinite(startsAt.getTime()) || endsAt <= startsAt) return;
  await updateDatabase((database) => {
    if (!database.corporateOpportunities.some((item) => item.id === parsed.data.opportunityId)) return;
    const now = new Date().toISOString();
    const id = randomUUID();
    database.corporateWorkshops.push({ id, opportunityId: parsed.data.opportunityId, proposalId: parsed.data.proposalId ?? null, title: parsed.data.title, workshopType: parsed.data.workshopType, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), deliveryMode: parsed.data.deliveryMode, location: parsed.data.location ?? "", joinUrl: parsed.data.joinUrl, status: "planned", facilitator: parsed.data.facilitator, participantTarget: parsed.data.participantTarget, outcomes: parsed.data.outcomes ?? "", notes: parsed.data.notes ?? "", createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "workshop.scheduled", entityType: "workshop", entityId: id, detail: `Scheduled ${parsed.data.title}`, createdAt: now });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/workshops`);
}

export async function updateCorporateWorkshopStatusAction(formData: FormData) {
  const user = await requireRole([...corporateRoles]);
  const parsed = z.object({ opportunityId: z.string().uuid(), workshopId: z.string().uuid(), status: z.enum(["planned", "confirmed", "completed", "cancelled"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const workshop = database.corporateWorkshops.find((item) => item.id === parsed.data.workshopId && item.opportunityId === parsed.data.opportunityId);
    if (!workshop) return;
    workshop.status = parsed.data.status;
    workshop.updatedAt = new Date().toISOString();
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "workshop.status_changed", entityType: "workshop", entityId: workshop.id, detail: `Changed ${workshop.title} to ${workshop.status}`, createdAt: new Date().toISOString() });
  });
  revalidatePath("/app/corporate");
  revalidatePath(`/app/corporate/${parsed.data.opportunityId}/workshops`);
}

export async function createWorkforceOperatorAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    profileId: z.string().uuid().optional(), applicationId: z.string().uuid().optional(), credentialId: z.string().uuid().optional(),
    fullName: z.string().min(2).max(160), email: z.string().email(), phone: z.string().max(40).optional(),
    location: z.string().min(2).max(120), operatorType: z.enum(["executive_assistant", "marketing", "sales", "operations", "customer_experience", "recruitment"]),
    status: z.enum(["applicant", "screening", "onboarding", "available"]), workMode: z.enum(["remote", "on_site", "hybrid"]),
    specialisation: z.string().min(3).max(300), skills: z.string().min(2).max(1000), experienceSummary: z.string().min(10).max(4000),
    readinessScore: z.coerce.number().int().min(0).max(100), monthlyCostAed: z.coerce.number().min(0).max(1_000_000),
    capacityHoursMonth: z.coerce.number().int().min(1).max(744), availableFrom: z.string().optional(),
  }).safeParse({
    ...Object.fromEntries(formData),
    profileId: formData.get("profileId") || undefined,
    applicationId: formData.get("applicationId") || undefined,
    credentialId: formData.get("credentialId") || undefined,
  });
  if (!parsed.success) return;
  const operatorId = randomUUID();
  const now = new Date().toISOString();
  await updateDatabase((database) => {
    if (parsed.data.profileId && database.workforceOperators.some((item) => item.profileId === parsed.data.profileId)) return;
    const sequence = Math.max(26000, ...database.workforceOperators.map((item) => Number(item.operatorNumber.replace(/\D/g, "")) || 0)) + 1;
    database.workforceOperators.push({
      id: operatorId, profileId: parsed.data.profileId ?? null, applicationId: parsed.data.applicationId ?? null,
      credentialId: parsed.data.credentialId ?? null, operatorNumber: `LYM-OP-${sequence}`, fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(), phone: parsed.data.phone ?? "", location: parsed.data.location,
      operatorType: parsed.data.operatorType, status: parsed.data.status, workMode: parsed.data.workMode,
      specialisation: parsed.data.specialisation, skills: parsed.data.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      experienceSummary: parsed.data.experienceSummary, readinessScore: parsed.data.readinessScore,
      monthlyCostAed: parsed.data.monthlyCostAed, capacityHoursMonth: parsed.data.capacityHoursMonth,
      availableFrom: parsed.data.availableFrom || null, backgroundCheckComplete: false, ndaSignedAt: null,
      dataPolicySignedAt: null, ownerId: user.id, createdAt: now, updatedAt: now,
    });
    onboardingChecklist.forEach((task, index) => database.operatorOnboardingItems.push({
      id: randomUUID(), operatorId, taskKey: task.key, label: task.label, category: task.category, status: "pending",
      dueDate: parsed.data.availableFrom || null, completedAt: null, completedBy: null, notes: "", sortOrder: (index + 1) * 10,
      createdAt: now, updatedAt: now,
    }));
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "operator.created", entityType: "operator", entityId: operatorId, detail: `Added ${parsed.data.fullName} to the qualified operator bench`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath("/app/workforce/operators");
  redirect(`/app/workforce/operators/${operatorId}`);
}

export async function updateWorkforceOperatorAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    operatorId: z.string().uuid(), profileId: z.string().uuid().optional(),
    status: z.enum(["applicant", "screening", "onboarding", "available", "matched", "deployed", "paused", "inactive"]),
    readinessScore: z.coerce.number().int().min(0).max(100), monthlyCostAed: z.coerce.number().min(0).max(1_000_000),
    capacityHoursMonth: z.coerce.number().int().min(1).max(744), availableFrom: z.string().optional(),
    specialisation: z.string().min(3).max(300), workMode: z.enum(["remote", "on_site", "hybrid"]),
  }).safeParse({ ...Object.fromEntries(formData), profileId: formData.get("profileId") || undefined });
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const operator = database.workforceOperators.find((item) => item.id === parsed.data.operatorId);
    if (!operator) return;
    if (parsed.data.profileId && database.workforceOperators.some((item) => item.id !== operator.id && item.profileId === parsed.data.profileId)) return;
    Object.assign(operator, {
      profileId: parsed.data.profileId ?? null, status: parsed.data.status, readinessScore: parsed.data.readinessScore, monthlyCostAed: parsed.data.monthlyCostAed,
      capacityHoursMonth: parsed.data.capacityHoursMonth, availableFrom: parsed.data.availableFrom || null,
      specialisation: parsed.data.specialisation, workMode: parsed.data.workMode, updatedAt: new Date().toISOString(),
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "operator.updated", entityType: "operator", entityId: operator.id, detail: `Updated deployment readiness for ${operator.fullName}`, createdAt: new Date().toISOString() });
  });
  revalidatePath("/app/workforce");
  revalidatePath("/app/workforce/operators");
  revalidatePath(`/app/workforce/operators/${parsed.data.operatorId}`);
}

export async function updateOperatorOnboardingItemAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    operatorId: z.string().uuid(), itemId: z.string().uuid(), status: z.enum(["pending", "in_progress", "complete", "waived"]),
    notes: z.string().max(2000).optional(),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const item = database.operatorOnboardingItems.find((entry) => entry.id === parsed.data.itemId && entry.operatorId === parsed.data.operatorId);
    if (!item) return;
    const now = new Date().toISOString();
    item.status = parsed.data.status;
    item.notes = parsed.data.notes ?? "";
    item.completedAt = ["complete", "waived"].includes(item.status) ? now : null;
    item.completedBy = ["complete", "waived"].includes(item.status) ? user.id : null;
    item.updatedAt = now;
    const tasks = database.operatorOnboardingItems.filter((entry) => entry.operatorId === item.operatorId);
    const operator = database.workforceOperators.find((entry) => entry.id === item.operatorId);
    if (operator && tasks.length > 0 && tasks.every((entry) => ["complete", "waived"].includes(entry.status)) && ["applicant", "screening", "onboarding"].includes(operator.status)) {
      operator.status = "available";
      operator.updatedAt = now;
    }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "operator.onboarding_updated", entityType: "operator", entityId: item.operatorId, detail: `${item.label}: ${item.status.replaceAll("_", " ")}`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath(`/app/workforce/operators/${parsed.data.operatorId}`);
}

export async function createWorkforceMatchAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    operatorId: z.string().uuid(), accountId: z.string().uuid(), opportunityId: z.string().uuid().optional(),
    roleTitle: z.string().min(3).max(180), status: z.enum(["suggested", "shortlisted", "client_review", "approved"]),
    matchScore: z.coerce.number().int().min(0).max(100), proposedRateAed: z.coerce.number().min(0).max(1_000_000),
    rationale: z.string().min(10).max(4000), clientRequirements: z.string().min(10).max(4000),
  }).safeParse({ ...Object.fromEntries(formData), opportunityId: formData.get("opportunityId") || undefined });
  if (!parsed.success) return;
  const matchId = randomUUID();
  await updateDatabase((database) => {
    const operator = database.workforceOperators.find((item) => item.id === parsed.data.operatorId);
    const account = database.corporateAccounts.find((item) => item.id === parsed.data.accountId);
    if (!operator || !account) return;
    const now = new Date().toISOString();
    database.workforceMatches.push({
      id: matchId, operatorId: operator.id, accountId: account.id, opportunityId: parsed.data.opportunityId ?? null,
      roleTitle: parsed.data.roleTitle, status: parsed.data.status, matchScore: parsed.data.matchScore,
      proposedRateAed: parsed.data.proposedRateAed, rationale: parsed.data.rationale,
      clientRequirements: parsed.data.clientRequirements, submittedAt: ["client_review", "approved"].includes(parsed.data.status) ? now : null,
      decidedAt: parsed.data.status === "approved" ? now : null, createdBy: user.id, createdAt: now, updatedAt: now,
    });
    if (parsed.data.status === "approved") operator.status = "matched";
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "match.created", entityType: "match", entityId: matchId, detail: `Matched ${operator.fullName} to ${account.companyName} at ${parsed.data.matchScore}% fit`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath(`/app/workforce/operators/${parsed.data.operatorId}`);
}

export async function updateWorkforceMatchStatusAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({ operatorId: z.string().uuid(), matchId: z.string().uuid(), status: z.enum(["suggested", "shortlisted", "client_review", "approved", "rejected", "withdrawn"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const match = database.workforceMatches.find((item) => item.id === parsed.data.matchId && item.operatorId === parsed.data.operatorId);
    if (!match) return;
    const now = new Date().toISOString();
    match.status = parsed.data.status;
    match.submittedAt = ["client_review", "approved"].includes(match.status) && !match.submittedAt ? now : match.submittedAt;
    match.decidedAt = ["approved", "rejected"].includes(match.status) ? now : null;
    match.updatedAt = now;
    const operator = database.workforceOperators.find((item) => item.id === match.operatorId);
    if (operator && match.status === "approved") operator.status = "matched";
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "match.status_changed", entityType: "match", entityId: match.id, detail: `Changed match to ${match.status.replaceAll("_", " ")}`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath(`/app/workforce/operators/${parsed.data.operatorId}`);
}

export async function createWorkforceDeploymentAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    matchId: z.string().uuid().optional(), operatorId: z.string().uuid(), accountId: z.string().uuid(), opportunityId: z.string().uuid().optional(),
    plan: z.enum(["starter", "growth", "scale", "custom"]), roleTitle: z.string().min(3).max(180),
    status: z.enum(["preparing", "active"]), startsOn: z.string().min(10), endsOn: z.string().optional(),
    minimumTermMonths: z.coerce.number().int().min(1).max(36), clientRateMonthlyAed: z.coerce.number().min(0).max(1_000_000),
    operatorCostMonthlyAed: z.coerce.number().min(0).max(1_000_000), managementAllocationAed: z.coerce.number().min(0).max(1_000_000),
    toolsOverheadAed: z.coerce.number().min(0).max(1_000_000), targetHoursMonth: z.coerce.number().int().min(1).max(744),
    clientOwnerName: z.string().min(2).max(160), clientOwnerEmail: z.string().email(), outcomes: z.string().min(10).max(5000),
    successMeasures: z.string().min(10).max(5000), nextReviewAt: z.string().optional(),
  }).safeParse({
    ...Object.fromEntries(formData), matchId: formData.get("matchId") || undefined,
    opportunityId: formData.get("opportunityId") || undefined,
  });
  if (!parsed.success) return;
  const deploymentId = randomUUID();
  await updateDatabase((database) => {
    const operator = database.workforceOperators.find((item) => item.id === parsed.data.operatorId);
    const account = database.corporateAccounts.find((item) => item.id === parsed.data.accountId);
    if (!operator || !account) return;
    const now = new Date().toISOString();
    const sequence = Math.max(26000, ...database.workforceDeployments.map((item) => Number(item.deploymentNumber.replace(/\D/g, "")) || 0)) + 1;
    database.workforceDeployments.push({
      id: deploymentId, deploymentNumber: `LYM-DEP-${sequence}`, matchId: parsed.data.matchId ?? null,
      operatorId: operator.id, accountId: account.id, opportunityId: parsed.data.opportunityId ?? null, plan: parsed.data.plan,
      roleTitle: parsed.data.roleTitle, status: parsed.data.status, startsOn: parsed.data.startsOn, endsOn: parsed.data.endsOn || null,
      minimumTermMonths: parsed.data.minimumTermMonths, clientRateMonthlyAed: parsed.data.clientRateMonthlyAed,
      operatorCostMonthlyAed: parsed.data.operatorCostMonthlyAed, managementAllocationAed: parsed.data.managementAllocationAed,
      toolsOverheadAed: parsed.data.toolsOverheadAed, targetHoursMonth: parsed.data.targetHoursMonth,
      accountManagerId: user.id, clientOwnerName: parsed.data.clientOwnerName, clientOwnerEmail: parsed.data.clientOwnerEmail.toLowerCase(),
      outcomes: parsed.data.outcomes, successMeasures: parsed.data.successMeasures,
      nextReviewAt: parsed.data.nextReviewAt ? new Date(parsed.data.nextReviewAt).toISOString() : null,
      endedAt: null, createdAt: now, updatedAt: now,
    });
    operator.status = parsed.data.status === "active" ? "deployed" : "matched";
    operator.updatedAt = now;
    account.status = "client";
    account.updatedAt = now;
    const match = parsed.data.matchId ? database.workforceMatches.find((item) => item.id === parsed.data.matchId) : null;
    if (match) { match.status = "approved"; match.decidedAt = now; match.updatedAt = now; }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "deployment.created", entityType: "deployment", entityId: deploymentId, detail: `Started ${parsed.data.roleTitle} deployment for ${account.companyName}`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  redirect(`/app/workforce/deployments/${deploymentId}`);
}

export async function updateWorkforceDeploymentAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    deploymentId: z.string().uuid(), status: z.enum(["preparing", "active", "paused", "completed", "terminated"]),
    nextReviewAt: z.string().optional(), outcomes: z.string().max(5000), successMeasures: z.string().max(5000),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const deployment = database.workforceDeployments.find((item) => item.id === parsed.data.deploymentId);
    if (!deployment) return;
    const now = new Date().toISOString();
    deployment.status = parsed.data.status;
    deployment.nextReviewAt = parsed.data.nextReviewAt ? new Date(parsed.data.nextReviewAt).toISOString() : null;
    deployment.outcomes = parsed.data.outcomes;
    deployment.successMeasures = parsed.data.successMeasures;
    deployment.endedAt = ["completed", "terminated"].includes(deployment.status) ? now : null;
    deployment.updatedAt = now;
    const operator = database.workforceOperators.find((item) => item.id === deployment.operatorId);
    if (operator) {
      operator.status = deployment.status === "active" ? "deployed" : deployment.status === "preparing" ? "matched" : deployment.status === "paused" ? "paused" : "available";
      operator.updatedAt = now;
    }
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "deployment.updated", entityType: "deployment", entityId: deployment.id, detail: `Changed ${deployment.deploymentNumber} to ${deployment.status}`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath(`/app/workforce/deployments/${parsed.data.deploymentId}`);
}

export async function createClientSopAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({
    deploymentId: z.string().uuid(), title: z.string().min(3).max(180), department: z.string().min(2).max(120),
    version: z.coerce.number().int().min(1).max(1000), status: z.enum(["draft", "review", "approved"]),
    riskLevel: z.enum(["green", "amber", "red"]), purpose: z.string().min(10).max(4000), approvedTools: z.string().max(2000),
    inputs: z.string().max(4000), procedure: z.string().min(20).max(12000), reviewCriteria: z.string().min(10).max(5000),
    dataControls: z.string().min(10).max(5000), humanApprover: z.string().min(2).max(180),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const sopId = randomUUID();
  await updateDatabase((database) => {
    if (!database.workforceDeployments.some((item) => item.id === parsed.data.deploymentId)) return;
    const now = new Date().toISOString();
    database.clientSops.push({
      id: sopId, deploymentId: parsed.data.deploymentId, title: parsed.data.title, department: parsed.data.department,
      version: parsed.data.version, status: parsed.data.status, riskLevel: parsed.data.riskLevel, purpose: parsed.data.purpose,
      approvedTools: parsed.data.approvedTools.split(",").map((tool) => tool.trim()).filter(Boolean), inputs: parsed.data.inputs,
      procedure: parsed.data.procedure, reviewCriteria: parsed.data.reviewCriteria, dataControls: parsed.data.dataControls,
      humanApprover: parsed.data.humanApprover, approvedBy: parsed.data.status === "approved" ? user.id : null,
      approvedAt: parsed.data.status === "approved" ? now : null, createdAt: now, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "sop.created", entityType: "sop", entityId: sopId, detail: `Created ${parsed.data.title} v${parsed.data.version}`, createdAt: now });
  });
  revalidatePath(`/app/workforce/deployments/${parsed.data.deploymentId}`);
}

export async function updateClientSopStatusAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const parsed = z.object({ deploymentId: z.string().uuid(), sopId: z.string().uuid(), status: z.enum(["draft", "review", "approved", "retired"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const sop = database.clientSops.find((item) => item.id === parsed.data.sopId && item.deploymentId === parsed.data.deploymentId);
    if (!sop) return;
    const now = new Date().toISOString();
    sop.status = parsed.data.status;
    sop.approvedBy = sop.status === "approved" ? user.id : null;
    sop.approvedAt = sop.status === "approved" ? now : null;
    sop.updatedAt = now;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "sop.status_changed", entityType: "sop", entityId: sop.id, detail: `Changed ${sop.title} to ${sop.status}`, createdAt: now });
  });
  revalidatePath(`/app/workforce/deployments/${parsed.data.deploymentId}`);
}

export async function createOperatorQualityReviewAction(formData: FormData) {
  const user = await requireRole([...workforceRoles]);
  const score = z.coerce.number().int().min(0).max(100);
  const parsed = z.object({
    deploymentId: z.string().uuid(), operatorId: z.string().uuid(), reviewDate: z.string().min(10),
    periodStart: z.string().min(10), periodEnd: z.string().min(10), qualityScore: score, reliabilityScore: score,
    responsibleAiScore: score, clientSatisfactionScore: score, utilisationPercent: z.coerce.number().int().min(0).max(200),
    hoursWorked: z.coerce.number().min(0).max(10000), hoursSaved: z.coerce.number().min(0).max(10000),
    riskIncidents: z.coerce.number().int().min(0).max(1000), clientFeedback: z.string().max(5000),
    strengths: z.string().max(5000), actions: z.string().max(5000), outcome: z.enum(["on_track", "coaching", "at_risk"]),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const reviewId = randomUUID();
  await updateDatabase((database) => {
    const deployment = database.workforceDeployments.find((item) => item.id === parsed.data.deploymentId && item.operatorId === parsed.data.operatorId);
    if (!deployment) return;
    const now = new Date().toISOString();
    database.operatorQualityReviews.unshift({ id: reviewId, ...parsed.data, reviewerId: user.id, createdAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "quality.reviewed", entityType: "quality_review", entityId: reviewId, detail: `Recorded ${parsed.data.outcome.replaceAll("_", " ")} QA review for ${deployment.deploymentNumber}`, createdAt: now });
  });
  revalidatePath("/app/workforce");
  revalidatePath(`/app/workforce/deployments/${parsed.data.deploymentId}`);
}

const proofContentStatuses = ["draft", "review", "approved", "published"] as const;
const proofEngagementTypes = ["academy", "team_enablement", "workforce", "workflow_implementation"] as const;
const corporatePackageValues = ["team_enablement_15", "team_enablement_30", "private_caio", "enterprise"] as const;
const commaList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export async function createOutcomeReportAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    accountId: z.string().uuid().optional(), opportunityId: z.string().uuid().optional(), deploymentId: z.string().uuid().optional(), cohortId: z.string().min(1).optional(),
    title: z.string().min(3).max(200), engagementType: z.enum(proofEngagementTypes), status: z.enum(proofContentStatuses),
    periodStart: z.string().min(10), periodEnd: z.string().min(10), executiveSummary: z.string().max(10000), baselineSummary: z.string().max(10000),
    outcomesSummary: z.string().max(10000), recommendations: z.string().max(10000), clientApproved: z.boolean(),
  }).refine((data) => data.accountId || data.opportunityId || data.deploymentId || data.cohortId, { message: "Select an engagement" })
    .refine((data) => data.periodEnd >= data.periodStart, { message: "Period end must follow period start" })
    .refine((data) => data.status !== "published" || data.clientApproved, { message: "Client approval is required to publish" })
    .safeParse({
      accountId: formData.get("accountId") || undefined, opportunityId: formData.get("opportunityId") || undefined,
      deploymentId: formData.get("deploymentId") || undefined, cohortId: formData.get("cohortId") || undefined,
      title: formData.get("title"), engagementType: formData.get("engagementType"), status: formData.get("status"),
      periodStart: formData.get("periodStart"), periodEnd: formData.get("periodEnd"), executiveSummary: formData.get("executiveSummary") || "",
      baselineSummary: formData.get("baselineSummary") || "", outcomesSummary: formData.get("outcomesSummary") || "",
      recommendations: formData.get("recommendations") || "", clientApproved: formData.get("clientApproved") === "on",
    });
  if (!parsed.success) redirect("/app/proof/reports/new?error=invalid");
  const reportId = randomUUID();
  await updateDatabase((database) => {
    const sequence = Math.max(26000, ...database.outcomeReports.map((item) => Number(item.reportNumber.replace(/\D/g, "")) || 0)) + 1;
    const now = new Date().toISOString();
    const approved = ["approved", "published"].includes(parsed.data.status);
    database.outcomeReports.unshift({
      id: reportId, reportNumber: `LYM-OUT-${sequence}`, ...parsed.data, accountId: parsed.data.accountId ?? null,
      opportunityId: parsed.data.opportunityId ?? null, deploymentId: parsed.data.deploymentId ?? null, cohortId: parsed.data.cohortId ?? null,
      expansionOpportunityId: null, approvedBy: approved ? user.id : null, approvedAt: approved ? now : null,
      publishedAt: parsed.data.status === "published" ? now : null, createdBy: user.id, createdAt: now, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.report_created", entityType: "outcome_report", entityId: reportId, detail: `Created ${parsed.data.title}`, createdAt: now });
  });
  redirect(`/app/proof/reports/${reportId}`);
}

export async function updateOutcomeReportAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    reportId: z.string().uuid(), title: z.string().min(3).max(200), status: z.enum(proofContentStatuses), periodStart: z.string().min(10),
    periodEnd: z.string().min(10), executiveSummary: z.string().max(10000), baselineSummary: z.string().max(10000), outcomesSummary: z.string().max(10000),
    recommendations: z.string().max(10000), clientApproved: z.boolean(),
  }).refine((data) => data.periodEnd >= data.periodStart, { message: "Invalid period" })
    .refine((data) => data.status !== "published" || data.clientApproved, { message: "Approval required" })
    .safeParse({ ...Object.fromEntries(formData), clientApproved: formData.get("clientApproved") === "on" });
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const report = database.outcomeReports.find((item) => item.id === parsed.data.reportId);
    if (!report) return;
    const now = new Date().toISOString();
    const approved = ["approved", "published"].includes(parsed.data.status);
    const { reportId: _reportId, ...updates } = parsed.data;
    Object.assign(report, updates, {
      approvedBy: approved ? report.approvedBy ?? user.id : null, approvedAt: approved ? report.approvedAt ?? now : null,
      publishedAt: parsed.data.status === "published" ? report.publishedAt ?? now : null, updatedAt: now,
    });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.report_updated", entityType: "outcome_report", entityId: report.id, detail: `Updated ${report.reportNumber} to ${report.status}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
}

export async function addOutcomeMetricAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    reportId: z.string().uuid(), name: z.string().min(2).max(120), unit: z.string().min(1).max(40), baselineValue: z.coerce.number(),
    currentValue: z.coerce.number(), targetValue: z.coerce.number().optional(), direction: z.enum(["increase", "decrease", "maintain"]),
    evidenceSource: z.string().max(2000), verified: z.boolean(),
  }).safeParse({ ...Object.fromEntries(formData), targetValue: formData.get("targetValue") || undefined, verified: formData.get("verified") === "on" });
  if (!parsed.success) return;
  const metricId = randomUUID();
  await updateDatabase((database) => {
    const report = database.outcomeReports.find((item) => item.id === parsed.data.reportId);
    if (!report) return;
    const now = new Date().toISOString();
    const sortOrder = Math.max(0, ...database.outcomeMetrics.filter((item) => item.outcomeReportId === report.id).map((item) => item.sortOrder)) + 10;
    const { reportId: _reportId, ...metric } = parsed.data;
    database.outcomeMetrics.push({ id: metricId, outcomeReportId: report.id, ...metric, targetValue: metric.targetValue ?? null, sortOrder, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.metric_added", entityType: "outcome_report", entityId: report.id, detail: `Added ${parsed.data.name} evidence`, createdAt: now });
  });
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
}

export async function saveCaseStudyAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    reportId: z.string().uuid(), caseStudyId: z.string().uuid().optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3).max(200), clientDisplayName: z.string().min(2).max(160), industry: z.string().max(120), summary: z.string().max(3000),
    challenge: z.string().max(10000), intervention: z.string().max(10000), result: z.string().max(10000), evidenceNote: z.string().max(4000),
    status: z.enum(proofContentStatuses), featured: z.boolean(), publicationConsent: z.boolean(),
  }).refine((data) => data.status !== "published" || data.publicationConsent, { message: "Consent required" }).safeParse({
    ...Object.fromEntries(formData), caseStudyId: formData.get("caseStudyId") || undefined,
    featured: formData.get("featured") === "on", publicationConsent: formData.get("publicationConsent") === "on",
  });
  if (!parsed.success) return;
  await updateDatabase((database) => {
    if (!database.outcomeReports.some((item) => item.id === parsed.data.reportId)) return;
    const now = new Date().toISOString();
    const existing = parsed.data.caseStudyId
      ? database.caseStudies.find((item) => item.id === parsed.data.caseStudyId && item.outcomeReportId === parsed.data.reportId)
      : database.caseStudies.find((item) => item.outcomeReportId === parsed.data.reportId);
    const { reportId: _reportId, caseStudyId: _caseStudyId, ...caseStudy } = parsed.data;
    if (existing) {
      Object.assign(existing, caseStudy, { outcomeReportId: parsed.data.reportId, publishedAt: caseStudy.status === "published" ? existing.publishedAt ?? now : null, updatedAt: now });
    } else {
      const id = randomUUID();
      database.caseStudies.unshift({ id, outcomeReportId: parsed.data.reportId, ...caseStudy, publishedAt: caseStudy.status === "published" ? now : null, createdBy: user.id, createdAt: now, updatedAt: now });
    }
    const saved = existing ?? database.caseStudies[0];
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.case_study_saved", entityType: "case_study", entityId: saved.id, detail: `Saved ${parsed.data.title}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
}

export async function createTestimonialAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    reportId: z.string().uuid(), accountId: z.string().uuid().optional(), caseStudyId: z.string().uuid().optional(), quote: z.string().min(10).max(3000),
    attributionName: z.string().min(2).max(120), attributionTitle: z.string().max(120), attributionCompany: z.string().max(160),
    permission: z.enum(["pending", "approved", "declined"]), source: z.string().max(300), status: z.enum(proofContentStatuses), collectedAt: z.string().min(10),
  }).refine((data) => data.status !== "published" || data.permission === "approved", { message: "Permission required" }).safeParse({
    ...Object.fromEntries(formData), accountId: formData.get("accountId") || undefined, caseStudyId: formData.get("caseStudyId") || undefined,
  });
  if (!parsed.success) return;
  const testimonialId = randomUUID();
  await updateDatabase((database) => {
    if (!database.outcomeReports.some((item) => item.id === parsed.data.reportId)) return;
    const now = new Date().toISOString();
    const { reportId: _reportId, ...testimonial } = parsed.data;
    database.testimonials.unshift({ id: testimonialId, ...testimonial, accountId: testimonial.accountId ?? null, caseStudyId: testimonial.caseStudyId ?? null, publishedAt: testimonial.status === "published" ? now : null, createdBy: user.id, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.testimonial_created", entityType: "testimonial", entityId: testimonialId, detail: `Recorded testimonial permission as ${parsed.data.permission}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
}

export async function updateTestimonialAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({ reportId: z.string().uuid(), testimonialId: z.string().uuid(), permission: z.enum(["pending", "approved", "declined"]), status: z.enum(proofContentStatuses) })
    .refine((data) => data.status !== "published" || data.permission === "approved", { message: "Permission required" }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const testimonial = database.testimonials.find((item) => item.id === parsed.data.testimonialId);
    if (!testimonial) return;
    const now = new Date().toISOString();
    testimonial.permission = parsed.data.permission;
    testimonial.status = parsed.data.status;
    testimonial.publishedAt = testimonial.status === "published" ? testimonial.publishedAt ?? now : null;
    testimonial.updatedAt = now;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.testimonial_updated", entityType: "testimonial", entityId: testimonial.id, detail: `Set testimonial to ${testimonial.permission} / ${testimonial.status}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
}

export async function createRoleSpecialisationAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(3).max(160),
    operatorType: z.enum(["executive_assistant", "marketing", "sales", "operations", "customer_experience", "recruitment"]),
    targetDepartment: z.string().min(2).max(120), promise: z.string().min(10).max(2000), responsibilities: z.string().max(4000),
    approvedTools: z.string().max(2000), successMetrics: z.string().max(2000), readinessRequirements: z.string().max(4000),
    targetHoursSavedMonth: z.coerce.number().min(0).max(744), status: z.enum(["draft", "pilot", "proven", "retired"]),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const id = randomUUID();
  await updateDatabase((database) => {
    const now = new Date().toISOString();
    database.roleSpecialisations.push({ ...parsed.data, id, responsibilities: commaList(parsed.data.responsibilities), approvedTools: commaList(parsed.data.approvedTools), successMetrics: commaList(parsed.data.successMetrics), ownerId: user.id, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.specialisation_created", entityType: "specialisation", entityId: id, detail: `Created ${parsed.data.name}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath("/app/proof/specialisations");
}

export async function updateRoleSpecialisationStatusAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({ specialisationId: z.string().uuid(), status: z.enum(["draft", "pilot", "proven", "retired"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const item = database.roleSpecialisations.find((entry) => entry.id === parsed.data.specialisationId);
    if (!item) return;
    item.status = parsed.data.status;
    item.updatedAt = new Date().toISOString();
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.specialisation_updated", entityType: "specialisation", entityId: item.id, detail: `Moved ${item.name} to ${item.status}`, createdAt: item.updatedAt });
  });
  revalidatePath("/app/proof/specialisations");
}

export async function createPartnershipAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    organizationName: z.string().min(2).max(160), type: z.enum(["business_community", "training_provider", "professional_association", "recruiter", "technology_provider", "referral_partner"]),
    status: z.enum(["prospect", "conversation", "active", "paused", "closed"]), contactName: z.string().max(120), contactEmail: z.string().max(160),
    contactPhone: z.string().max(60), website: z.string().max(300), valueProposition: z.string().max(3000), nextStep: z.string().max(1000), nextStepDueAt: z.string().optional(),
  }).safeParse({ ...Object.fromEntries(formData), nextStepDueAt: formData.get("nextStepDueAt") || undefined });
  if (!parsed.success) return;
  const id = randomUUID();
  await updateDatabase((database) => {
    const now = new Date().toISOString();
    database.partnerships.unshift({ id, ...parsed.data, nextStepDueAt: parsed.data.nextStepDueAt ?? null, ownerId: user.id, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.partnership_created", entityType: "partnership", entityId: id, detail: `Added ${parsed.data.organizationName}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath("/app/proof/partnerships");
}

export async function updatePartnershipAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({ partnershipId: z.string().uuid(), status: z.enum(["prospect", "conversation", "active", "paused", "closed"]), nextStep: z.string().max(1000), nextStepDueAt: z.string().optional() })
    .safeParse({ ...Object.fromEntries(formData), nextStepDueAt: formData.get("nextStepDueAt") || undefined });
  if (!parsed.success) return;
  await updateDatabase((database) => {
    const item = database.partnerships.find((entry) => entry.id === parsed.data.partnershipId);
    if (!item) return;
    const now = new Date().toISOString();
    item.status = parsed.data.status; item.nextStep = parsed.data.nextStep; item.nextStepDueAt = parsed.data.nextStepDueAt ?? null; item.updatedAt = now;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.partnership_updated", entityType: "partnership", entityId: item.id, detail: `Updated ${item.organizationName}`, createdAt: now });
  });
  revalidatePath("/app/proof/partnerships");
}

export async function createPartnerReferralAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    partnershipId: z.string().uuid(), accountId: z.string().uuid().optional(), opportunityId: z.string().uuid().optional(), contactName: z.string().max(120),
    companyName: z.string().min(2).max(160), status: z.enum(["referred", "qualified", "converted", "lost"]), estimatedValueAed: z.coerce.number().min(0),
    notes: z.string().max(3000), referredAt: z.string().min(10),
  }).safeParse({ ...Object.fromEntries(formData), accountId: formData.get("accountId") || undefined, opportunityId: formData.get("opportunityId") || undefined });
  if (!parsed.success) return;
  const id = randomUUID();
  await updateDatabase((database) => {
    if (!database.partnerships.some((item) => item.id === parsed.data.partnershipId)) return;
    const now = new Date().toISOString();
    database.partnerReferrals.unshift({ id, ...parsed.data, accountId: parsed.data.accountId ?? null, opportunityId: parsed.data.opportunityId ?? null, convertedAt: parsed.data.status === "converted" ? now : null, createdBy: user.id, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.referral_created", entityType: "referral", entityId: id, detail: `Added partner referral for ${parsed.data.companyName}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath("/app/proof/partnerships");
}

export async function createRepeatabilityBenchmarkAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    specialisationId: z.string().uuid().optional(), engagementType: z.enum(proofEngagementTypes), industry: z.string().min(2).max(120),
    metricName: z.string().min(2).max(120), unit: z.string().min(1).max(40), sampleSize: z.coerce.number().int().min(1),
    medianBaseline: z.coerce.number(), medianResult: z.coerce.number(), improvementPercent: z.coerce.number().min(-1000).max(10000),
    evidenceThreshold: z.coerce.number().int().min(1).max(1000), status: z.enum(["emerging", "validated", "reference"]),
  }).safeParse({ ...Object.fromEntries(formData), specialisationId: formData.get("specialisationId") || undefined });
  if (!parsed.success) return;
  const id = randomUUID();
  await updateDatabase((database) => {
    const now = new Date().toISOString();
    database.repeatabilityBenchmarks.unshift({ id, ...parsed.data, specialisationId: parsed.data.specialisationId ?? null, reviewedBy: user.id, reviewedAt: now, createdAt: now, updatedAt: now });
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.benchmark_created", entityType: "benchmark", entityId: id, detail: `Recorded ${parsed.data.metricName} benchmark`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath("/app/proof/specialisations");
}

export async function createExpansionOpportunityAction(formData: FormData) {
  const user = await requireRole([...proofRoles]);
  const parsed = z.object({
    reportId: z.string().uuid(), title: z.string().min(3).max(180), package: z.enum(corporatePackageValues), valueAed: z.coerce.number().min(0),
    nextStep: z.string().min(3).max(1000), expectedCloseDate: z.string().optional(),
  }).safeParse({ ...Object.fromEntries(formData), expectedCloseDate: formData.get("expectedCloseDate") || undefined });
  if (!parsed.success) return;
  let opportunityId = "";
  await updateDatabase((database) => {
    const report = database.outcomeReports.find((item) => item.id === parsed.data.reportId);
    if (!report?.accountId || report.expansionOpportunityId) return;
    const now = new Date().toISOString();
    opportunityId = randomUUID();
    database.corporateOpportunities.unshift({ id: opportunityId, accountId: report.accountId, title: parsed.data.title, package: parsed.data.package as CorporatePackage, participantCount: 1, stage: "qualified", valueAed: parsed.data.valueAed, probability: 40, expectedCloseDate: parsed.data.expectedCloseDate ?? null, nextStep: parsed.data.nextStep, nextStepDueAt: parsed.data.expectedCloseDate ?? null, ownerId: user.id, lostReason: "", createdAt: now, updatedAt: now });
    report.expansionOpportunityId = opportunityId;
    report.updatedAt = now;
    database.activities.unshift({ id: randomUUID(), actorId: user.id, action: "proof.expansion_created", entityType: "opportunity", entityId: opportunityId, detail: `Created expansion opportunity from ${report.reportNumber}`, createdAt: now });
  });
  revalidatePath("/app/proof");
  revalidatePath(`/app/proof/reports/${parsed.data.reportId}`);
  revalidatePath("/app/corporate");
  if (opportunityId) redirect(`/app/corporate/${opportunityId}`);
}
