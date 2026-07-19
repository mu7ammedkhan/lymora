import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  Activity,
  Application,
  AssessmentComponent,
  AssessmentResult,
  AssessmentSubmission,
  AttendanceRecord,
  Cohort,
  CohortModule,
  CohortSession,
  CorporateAccount,
  CorporateOpportunity,
  CorporateProposal,
  CorporateWorkshop,
  Credential,
  DatabaseSchema,
  Enrollment,
  LearningModule,
  ReadinessAssessment,
  Role,
  User,
  WorkflowOpportunity,
} from "@/lib/os/types";
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

function rowToLearningModule(row: Row): LearningModule {
  return {
    id: String(row.id), programCode: String(row.program_code), code: String(row.code), weekNumber: Number(row.week_number),
    title: String(row.title), summary: String(row.summary), competencyDomain: String(row.competency_domain), liveHours: Number(row.live_hours),
    status: row.status as LearningModule["status"], sortOrder: Number(row.sort_order), createdAt: String(row.created_at),
  };
}

function rowToCohortModule(row: Row): CohortModule {
  return { id: String(row.id), cohortId: String(row.cohort_id), moduleId: String(row.module_id), opensAt: String(row.opens_at), dueAt: String(row.due_at), status: row.status as CohortModule["status"] };
}

function rowToCohortSession(row: Row): CohortSession {
  return {
    id: String(row.id), cohortId: String(row.cohort_id), moduleId: row.module_id ? String(row.module_id) : null, title: String(row.title),
    startsAt: String(row.starts_at), endsAt: String(row.ends_at), deliveryMode: row.delivery_mode as CohortSession["deliveryMode"],
    joinUrl: String(row.join_url), status: row.status as CohortSession["status"], createdBy: row.created_by ? String(row.created_by) : null,
    createdAt: String(row.created_at),
  };
}

function rowToAttendance(row: Row): AttendanceRecord {
  return {
    id: String(row.id), sessionId: String(row.session_id), enrollmentId: String(row.enrollment_id), status: row.status as AttendanceRecord["status"],
    minutesAttended: Number(row.minutes_attended), notes: String(row.notes), markedBy: row.marked_by ? String(row.marked_by) : null,
    markedAt: String(row.marked_at),
  };
}

function rowToAssessmentComponent(row: Row): AssessmentComponent {
  return {
    id: String(row.id), programCode: String(row.program_code), code: String(row.code), title: String(row.title), description: String(row.description),
    weight: Number(row.weight), passThreshold: Number(row.pass_threshold), responsibleAiGate: Boolean(row.responsible_ai_gate),
    sortOrder: Number(row.sort_order), createdAt: String(row.created_at),
  };
}

function rowToAssessmentSubmission(row: Row): AssessmentSubmission {
  return {
    id: String(row.id), enrollmentId: String(row.enrollment_id), componentId: String(row.component_id), status: row.status as AssessmentSubmission["status"],
    evidenceUrl: String(row.evidence_url), submissionNotes: String(row.submission_notes), submittedAt: row.submitted_at ? String(row.submitted_at) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToAssessmentResult(row: Row): AssessmentResult {
  return {
    id: String(row.id), submissionId: String(row.submission_id), score: Number(row.score), outcome: row.outcome as AssessmentResult["outcome"],
    feedback: String(row.feedback), gradedBy: row.graded_by ? String(row.graded_by) : null, gradedAt: String(row.graded_at),
  };
}

function rowToCredential(row: Row): Credential {
  return {
    id: String(row.id), enrollmentId: String(row.enrollment_id), credentialNumber: String(row.credential_number), status: row.status as Credential["status"],
    overallScore: Number(row.overall_score), classification: row.classification as Credential["classification"],
    issuedAt: row.issued_at ? String(row.issued_at) : null, expiresAt: row.expires_at ? String(row.expires_at) : null,
    verificationCode: String(row.verification_code), issuedBy: row.issued_by ? String(row.issued_by) : null, createdAt: String(row.created_at),
  };
}

function rowToCorporateAccount(row: Row): CorporateAccount {
  return {
    id: String(row.id), companyName: String(row.company_name), website: String(row.website), industry: String(row.industry),
    employeeBand: String(row.employee_band), location: String(row.location), primaryContactName: String(row.primary_contact_name),
    primaryContactEmail: String(row.primary_contact_email), primaryContactPhone: String(row.primary_contact_phone),
    primaryContactTitle: String(row.primary_contact_title), ownerId: row.owner_id ? String(row.owner_id) : null, source: String(row.source),
    status: row.status as CorporateAccount["status"], notes: String(row.notes), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToCorporateOpportunity(row: Row): CorporateOpportunity {
  return {
    id: String(row.id), accountId: String(row.account_id), title: String(row.title), package: row.package as CorporateOpportunity["package"],
    participantCount: Number(row.participant_count), stage: row.stage as CorporateOpportunity["stage"], valueAed: Number(row.value_aed),
    probability: Number(row.probability), expectedCloseDate: row.expected_close_date ? String(row.expected_close_date) : null,
    nextStep: String(row.next_step), nextStepDueAt: row.next_step_due_at ? String(row.next_step_due_at) : null,
    ownerId: row.owner_id ? String(row.owner_id) : null, lostReason: String(row.lost_reason), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToReadinessAssessment(row: Row): ReadinessAssessment {
  return {
    id: String(row.id), opportunityId: String(row.opportunity_id), status: row.status as ReadinessAssessment["status"],
    respondentName: String(row.respondent_name), leadershipScore: Number(row.leadership_score), peopleScore: Number(row.people_score),
    processScore: Number(row.process_score), dataScore: Number(row.data_score), toolsScore: Number(row.tools_score),
    governanceScore: Number(row.governance_score), adoptionScore: Number(row.adoption_score), overallScore: Number(row.overall_score),
    maturity: row.maturity as ReadinessAssessment["maturity"], executiveSummary: String(row.executive_summary), priorities: String(row.priorities),
    risks: String(row.risks), completedAt: row.completed_at ? String(row.completed_at) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToWorkflowOpportunity(row: Row): WorkflowOpportunity {
  return {
    id: String(row.id), readinessAssessmentId: String(row.readiness_assessment_id), workflowName: String(row.workflow_name),
    department: String(row.department), currentPain: String(row.current_pain), frequency: String(row.frequency), valueScore: Number(row.value_score),
    feasibilityScore: Number(row.feasibility_score), riskLevel: row.risk_level as WorkflowOpportunity["riskLevel"],
    humanOversight: String(row.human_oversight), recommendation: String(row.recommendation), priority: Number(row.priority), createdAt: String(row.created_at),
  };
}

function rowToCorporateProposal(row: Row): CorporateProposal {
  return {
    id: String(row.id), opportunityId: String(row.opportunity_id), proposalNumber: String(row.proposal_number), package: row.package as CorporateProposal["package"],
    participantCount: Number(row.participant_count), subtotalAed: Number(row.subtotal_aed), vatRate: Number(row.vat_rate), vatAed: Number(row.vat_aed),
    totalAed: Number(row.total_aed), scope: String(row.scope), timeline: String(row.timeline), assumptions: String(row.assumptions),
    status: row.status as CorporateProposal["status"], validUntil: String(row.valid_until), sentAt: row.sent_at ? String(row.sent_at) : null,
    acceptedAt: row.accepted_at ? String(row.accepted_at) : null, createdBy: row.created_by ? String(row.created_by) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToCorporateWorkshop(row: Row): CorporateWorkshop {
  return {
    id: String(row.id), opportunityId: String(row.opportunity_id), proposalId: row.proposal_id ? String(row.proposal_id) : null,
    title: String(row.title), workshopType: row.workshop_type as CorporateWorkshop["workshopType"], startsAt: String(row.starts_at),
    endsAt: String(row.ends_at), deliveryMode: row.delivery_mode as CorporateWorkshop["deliveryMode"], location: String(row.location),
    joinUrl: String(row.join_url), status: row.status as CorporateWorkshop["status"], facilitator: String(row.facilitator),
    participantTarget: Number(row.participant_target), outcomes: String(row.outcomes), notes: String(row.notes),
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
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

function learningModuleToRow(item: LearningModule) {
  return { id: item.id, program_code: item.programCode, code: item.code, week_number: item.weekNumber, title: item.title, summary: item.summary, competency_domain: item.competencyDomain, live_hours: item.liveHours, status: item.status, sort_order: item.sortOrder, created_at: item.createdAt };
}

function cohortModuleToRow(item: CohortModule) {
  return { id: item.id, cohort_id: item.cohortId, module_id: item.moduleId, opens_at: item.opensAt, due_at: item.dueAt, status: item.status };
}

function cohortSessionToRow(item: CohortSession) {
  return { id: item.id, cohort_id: item.cohortId, module_id: item.moduleId, title: item.title, starts_at: item.startsAt, ends_at: item.endsAt, delivery_mode: item.deliveryMode, join_url: item.joinUrl, status: item.status, created_by: item.createdBy, created_at: item.createdAt };
}

function attendanceToRow(item: AttendanceRecord) {
  return { id: item.id, session_id: item.sessionId, enrollment_id: item.enrollmentId, status: item.status, minutes_attended: item.minutesAttended, notes: item.notes, marked_by: item.markedBy, marked_at: item.markedAt };
}

function assessmentComponentToRow(item: AssessmentComponent) {
  return { id: item.id, program_code: item.programCode, code: item.code, title: item.title, description: item.description, weight: item.weight, pass_threshold: item.passThreshold, responsible_ai_gate: item.responsibleAiGate, sort_order: item.sortOrder, created_at: item.createdAt };
}

function assessmentSubmissionToRow(item: AssessmentSubmission) {
  return { id: item.id, enrollment_id: item.enrollmentId, component_id: item.componentId, status: item.status, evidence_url: item.evidenceUrl, submission_notes: item.submissionNotes, submitted_at: item.submittedAt, created_at: item.createdAt, updated_at: item.updatedAt };
}

function assessmentResultToRow(item: AssessmentResult) {
  return { id: item.id, submission_id: item.submissionId, score: item.score, outcome: item.outcome, feedback: item.feedback, graded_by: item.gradedBy, graded_at: item.gradedAt };
}

function credentialToRow(item: Credential) {
  return { id: item.id, enrollment_id: item.enrollmentId, credential_number: item.credentialNumber, status: item.status, overall_score: item.overallScore, classification: item.classification, issued_at: item.issuedAt, expires_at: item.expiresAt, verification_code: item.verificationCode, issued_by: item.issuedBy, created_at: item.createdAt };
}

function corporateAccountToRow(item: CorporateAccount) {
  return { id: item.id, company_name: item.companyName, website: item.website, industry: item.industry, employee_band: item.employeeBand, location: item.location, primary_contact_name: item.primaryContactName, primary_contact_email: item.primaryContactEmail, primary_contact_phone: item.primaryContactPhone, primary_contact_title: item.primaryContactTitle, owner_id: item.ownerId, source: item.source, status: item.status, notes: item.notes, created_at: item.createdAt, updated_at: item.updatedAt };
}

function corporateOpportunityToRow(item: CorporateOpportunity) {
  return { id: item.id, account_id: item.accountId, title: item.title, package: item.package, participant_count: item.participantCount, stage: item.stage, value_aed: item.valueAed, probability: item.probability, expected_close_date: item.expectedCloseDate, next_step: item.nextStep, next_step_due_at: item.nextStepDueAt, owner_id: item.ownerId, lost_reason: item.lostReason, created_at: item.createdAt, updated_at: item.updatedAt };
}

function readinessAssessmentToRow(item: ReadinessAssessment) {
  return { id: item.id, opportunity_id: item.opportunityId, status: item.status, respondent_name: item.respondentName, leadership_score: item.leadershipScore, people_score: item.peopleScore, process_score: item.processScore, data_score: item.dataScore, tools_score: item.toolsScore, governance_score: item.governanceScore, adoption_score: item.adoptionScore, overall_score: item.overallScore, maturity: item.maturity, executive_summary: item.executiveSummary, priorities: item.priorities, risks: item.risks, completed_at: item.completedAt, created_at: item.createdAt, updated_at: item.updatedAt };
}

function workflowOpportunityToRow(item: WorkflowOpportunity) {
  return { id: item.id, readiness_assessment_id: item.readinessAssessmentId, workflow_name: item.workflowName, department: item.department, current_pain: item.currentPain, frequency: item.frequency, value_score: item.valueScore, feasibility_score: item.feasibilityScore, risk_level: item.riskLevel, human_oversight: item.humanOversight, recommendation: item.recommendation, priority: item.priority, created_at: item.createdAt };
}

function corporateProposalToRow(item: CorporateProposal) {
  return { id: item.id, opportunity_id: item.opportunityId, proposal_number: item.proposalNumber, package: item.package, participant_count: item.participantCount, subtotal_aed: item.subtotalAed, vat_rate: item.vatRate, vat_aed: item.vatAed, total_aed: item.totalAed, scope: item.scope, timeline: item.timeline, assumptions: item.assumptions, status: item.status, valid_until: item.validUntil, sent_at: item.sentAt, accepted_at: item.acceptedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function corporateWorkshopToRow(item: CorporateWorkshop) {
  return { id: item.id, opportunity_id: item.opportunityId, proposal_id: item.proposalId, title: item.title, workshop_type: item.workshopType, starts_at: item.startsAt, ends_at: item.endsAt, delivery_mode: item.deliveryMode, location: item.location, join_url: item.joinUrl, status: item.status, facilitator: item.facilitator, participant_target: item.participantTarget, outcomes: item.outcomes, notes: item.notes, created_at: item.createdAt, updated_at: item.updatedAt };
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
  const [profilesResult, applicationsResult, cohortsResult, enrollmentsResult, modulesResult, cohortModulesResult, sessionsResult, attendanceResult, componentsResult, submissionsResult, resultsResult, credentialsResult, accountsResult, opportunitiesResult, readinessResult, workflowsResult, proposalsResult, workshopsResult, activitiesResult] = await Promise.all([
    client.from("profiles").select("*").order("created_at", { ascending: true }),
    client.from("applications").select("*").order("created_at", { ascending: false }),
    client.from("cohorts").select("*").order("start_date", { ascending: true }),
    client.from("enrollments").select("*").order("created_at", { ascending: true }),
    client.from("learning_modules").select("*").order("sort_order", { ascending: true }),
    client.from("cohort_modules").select("*").order("opens_at", { ascending: true }),
    client.from("cohort_sessions").select("*").order("starts_at", { ascending: true }),
    client.from("attendance_records").select("*").order("marked_at", { ascending: false }),
    client.from("assessment_components").select("*").order("sort_order", { ascending: true }),
    client.from("assessment_submissions").select("*").order("updated_at", { ascending: false }),
    client.from("assessment_results").select("*").order("graded_at", { ascending: false }),
    client.from("credentials").select("*").order("created_at", { ascending: false }),
    client.from("corporate_accounts").select("*").order("created_at", { ascending: false }),
    client.from("corporate_opportunities").select("*").order("updated_at", { ascending: false }),
    client.from("readiness_assessments").select("*").order("updated_at", { ascending: false }),
    client.from("workflow_opportunities").select("*").order("priority", { ascending: true }),
    client.from("corporate_proposals").select("*").order("created_at", { ascending: false }),
    client.from("corporate_workshops").select("*").order("starts_at", { ascending: true }),
    client.from("activities").select("*").order("created_at", { ascending: false }).limit(500),
  ]);
  const profiles = await requireRows("profiles", profilesResult);
  const applications = await requireRows("applications", applicationsResult);
  const cohorts = await requireRows("cohorts", cohortsResult);
  const enrollments = await requireRows("enrollments", enrollmentsResult);
  const modules = await requireRows("learning_modules", modulesResult);
  const cohortModules = await requireRows("cohort_modules", cohortModulesResult);
  const sessions = await requireRows("cohort_sessions", sessionsResult);
  const attendance = await requireRows("attendance_records", attendanceResult);
  const components = await requireRows("assessment_components", componentsResult);
  const submissions = await requireRows("assessment_submissions", submissionsResult);
  const results = await requireRows("assessment_results", resultsResult);
  const credentials = await requireRows("credentials", credentialsResult);
  const accounts = await requireRows("corporate_accounts", accountsResult);
  const opportunities = await requireRows("corporate_opportunities", opportunitiesResult);
  const readiness = await requireRows("readiness_assessments", readinessResult);
  const workflows = await requireRows("workflow_opportunities", workflowsResult);
  const proposals = await requireRows("corporate_proposals", proposalsResult);
  const workshops = await requireRows("corporate_workshops", workshopsResult);
  const activities = await requireRows("activities", activitiesResult);
  return {
    users: profiles.map(profileToUser), sessions: [], applications: applications.map(rowToApplication), cohorts: cohorts.map(rowToCohort),
    enrollments: enrollments.map(rowToEnrollment), learningModules: modules.map(rowToLearningModule), cohortModules: cohortModules.map(rowToCohortModule),
    cohortSessions: sessions.map(rowToCohortSession), attendanceRecords: attendance.map(rowToAttendance), assessmentComponents: components.map(rowToAssessmentComponent),
    assessmentSubmissions: submissions.map(rowToAssessmentSubmission), assessmentResults: results.map(rowToAssessmentResult), credentials: credentials.map(rowToCredential),
    corporateAccounts: accounts.map(rowToCorporateAccount), corporateOpportunities: opportunities.map(rowToCorporateOpportunity),
    readinessAssessments: readiness.map(rowToReadinessAssessment), workflowOpportunities: workflows.map(rowToWorkflowOpportunity),
    corporateProposals: proposals.map(rowToCorporateProposal), corporateWorkshops: workshops.map(rowToCorporateWorkshop),
    activities: activities.map(rowToActivity),
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
  await upsertRows("learning_modules", changedItems(before.learningModules, after.learningModules).map(learningModuleToRow));
  await upsertRows("cohort_modules", changedItems(before.cohortModules, after.cohortModules).map(cohortModuleToRow));
  await upsertRows("cohort_sessions", changedItems(before.cohortSessions, after.cohortSessions).map(cohortSessionToRow));
  await upsertRows("attendance_records", changedItems(before.attendanceRecords, after.attendanceRecords).map(attendanceToRow));
  await upsertRows("assessment_components", changedItems(before.assessmentComponents, after.assessmentComponents).map(assessmentComponentToRow));
  await upsertRows("assessment_submissions", changedItems(before.assessmentSubmissions, after.assessmentSubmissions).map(assessmentSubmissionToRow));
  await upsertRows("assessment_results", changedItems(before.assessmentResults, after.assessmentResults).map(assessmentResultToRow));
  await upsertRows("credentials", changedItems(before.credentials, after.credentials).map(credentialToRow));
  await upsertRows("corporate_accounts", changedItems(before.corporateAccounts, after.corporateAccounts).map(corporateAccountToRow));
  await upsertRows("corporate_opportunities", changedItems(before.corporateOpportunities, after.corporateOpportunities).map(corporateOpportunityToRow));
  await upsertRows("readiness_assessments", changedItems(before.readinessAssessments, after.readinessAssessments).map(readinessAssessmentToRow));
  await upsertRows("workflow_opportunities", changedItems(before.workflowOpportunities, after.workflowOpportunities).map(workflowOpportunityToRow));
  await upsertRows("corporate_proposals", changedItems(before.corporateProposals, after.corporateProposals).map(corporateProposalToRow));
  await upsertRows("corporate_workshops", changedItems(before.corporateWorkshops, after.corporateWorkshops).map(corporateWorkshopToRow));
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
