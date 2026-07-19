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
  CaseStudy,
  Credential,
  ClientSop,
  DatabaseSchema,
  Enrollment,
  LearningModule,
  OperatorOnboardingItem,
  OperatorQualityReview,
  OutcomeMetric,
  OutcomeReport,
  PartnerReferral,
  Partnership,
  ReadinessAssessment,
  RepeatabilityBenchmark,
  Role,
  RoleSpecialisation,
  Testimonial,
  User,
  WorkforceDeployment,
  WorkforceMatch,
  WorkforceOperator,
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

function rowToWorkforceOperator(row: Row): WorkforceOperator {
  return {
    id: String(row.id), profileId: row.profile_id ? String(row.profile_id) : null, applicationId: row.application_id ? String(row.application_id) : null,
    credentialId: row.credential_id ? String(row.credential_id) : null, operatorNumber: String(row.operator_number), fullName: String(row.full_name),
    email: String(row.email), phone: String(row.phone), location: String(row.location), operatorType: row.operator_type as WorkforceOperator["operatorType"],
    status: row.status as WorkforceOperator["status"], workMode: row.work_mode as WorkforceOperator["workMode"], specialisation: String(row.specialisation),
    skills: Array.isArray(row.skills) ? row.skills.map(String) : [], experienceSummary: String(row.experience_summary), readinessScore: Number(row.readiness_score),
    monthlyCostAed: Number(row.monthly_cost_aed), capacityHoursMonth: Number(row.capacity_hours_month),
    availableFrom: row.available_from ? String(row.available_from) : null, backgroundCheckComplete: Boolean(row.background_check_complete),
    ndaSignedAt: row.nda_signed_at ? String(row.nda_signed_at) : null, dataPolicySignedAt: row.data_policy_signed_at ? String(row.data_policy_signed_at) : null,
    ownerId: row.owner_id ? String(row.owner_id) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToOperatorOnboardingItem(row: Row): OperatorOnboardingItem {
  return {
    id: String(row.id), operatorId: String(row.operator_id), taskKey: String(row.task_key), label: String(row.label), category: String(row.category),
    status: row.status as OperatorOnboardingItem["status"], dueDate: row.due_date ? String(row.due_date) : null,
    completedAt: row.completed_at ? String(row.completed_at) : null, completedBy: row.completed_by ? String(row.completed_by) : null,
    notes: String(row.notes), sortOrder: Number(row.sort_order), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToWorkforceMatch(row: Row): WorkforceMatch {
  return {
    id: String(row.id), operatorId: String(row.operator_id), accountId: String(row.account_id),
    opportunityId: row.opportunity_id ? String(row.opportunity_id) : null, roleTitle: String(row.role_title), status: row.status as WorkforceMatch["status"],
    matchScore: Number(row.match_score), proposedRateAed: Number(row.proposed_rate_aed), rationale: String(row.rationale),
    clientRequirements: String(row.client_requirements), submittedAt: row.submitted_at ? String(row.submitted_at) : null,
    decidedAt: row.decided_at ? String(row.decided_at) : null, createdBy: row.created_by ? String(row.created_by) : null,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToWorkforceDeployment(row: Row): WorkforceDeployment {
  return {
    id: String(row.id), deploymentNumber: String(row.deployment_number), matchId: row.match_id ? String(row.match_id) : null,
    operatorId: String(row.operator_id), accountId: String(row.account_id), opportunityId: row.opportunity_id ? String(row.opportunity_id) : null,
    plan: row.plan as WorkforceDeployment["plan"], roleTitle: String(row.role_title), status: row.status as WorkforceDeployment["status"],
    startsOn: String(row.starts_on), endsOn: row.ends_on ? String(row.ends_on) : null, minimumTermMonths: Number(row.minimum_term_months),
    clientRateMonthlyAed: Number(row.client_rate_monthly_aed), operatorCostMonthlyAed: Number(row.operator_cost_monthly_aed),
    managementAllocationAed: Number(row.management_allocation_aed), toolsOverheadAed: Number(row.tools_overhead_aed),
    targetHoursMonth: Number(row.target_hours_month), accountManagerId: row.account_manager_id ? String(row.account_manager_id) : null,
    clientOwnerName: String(row.client_owner_name), clientOwnerEmail: String(row.client_owner_email), outcomes: String(row.outcomes),
    successMeasures: String(row.success_measures), nextReviewAt: row.next_review_at ? String(row.next_review_at) : null,
    endedAt: row.ended_at ? String(row.ended_at) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToClientSop(row: Row): ClientSop {
  return {
    id: String(row.id), deploymentId: String(row.deployment_id), title: String(row.title), department: String(row.department),
    version: Number(row.version), status: row.status as ClientSop["status"], riskLevel: row.risk_level as ClientSop["riskLevel"],
    purpose: String(row.purpose), approvedTools: Array.isArray(row.approved_tools) ? row.approved_tools.map(String) : [],
    inputs: String(row.inputs), procedure: String(row.procedure), reviewCriteria: String(row.review_criteria), dataControls: String(row.data_controls),
    humanApprover: String(row.human_approver), approvedBy: row.approved_by ? String(row.approved_by) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToOperatorQualityReview(row: Row): OperatorQualityReview {
  return {
    id: String(row.id), deploymentId: String(row.deployment_id), operatorId: String(row.operator_id), reviewDate: String(row.review_date),
    periodStart: String(row.period_start), periodEnd: String(row.period_end), reviewerId: row.reviewer_id ? String(row.reviewer_id) : null,
    qualityScore: Number(row.quality_score), reliabilityScore: Number(row.reliability_score), responsibleAiScore: Number(row.responsible_ai_score),
    clientSatisfactionScore: Number(row.client_satisfaction_score), utilisationPercent: Number(row.utilisation_percent),
    hoursWorked: Number(row.hours_worked), hoursSaved: Number(row.hours_saved), riskIncidents: Number(row.risk_incidents),
    clientFeedback: String(row.client_feedback), strengths: String(row.strengths), actions: String(row.actions),
    outcome: row.outcome as OperatorQualityReview["outcome"], createdAt: String(row.created_at),
  };
}

function rowToOutcomeReport(row: Row): OutcomeReport {
  return {
    id: String(row.id), reportNumber: String(row.report_number), accountId: row.account_id ? String(row.account_id) : null,
    opportunityId: row.opportunity_id ? String(row.opportunity_id) : null, deploymentId: row.deployment_id ? String(row.deployment_id) : null,
    cohortId: row.cohort_id ? String(row.cohort_id) : null, expansionOpportunityId: row.expansion_opportunity_id ? String(row.expansion_opportunity_id) : null,
    title: String(row.title), engagementType: row.engagement_type as OutcomeReport["engagementType"], status: row.status as OutcomeReport["status"],
    periodStart: String(row.period_start), periodEnd: String(row.period_end), executiveSummary: String(row.executive_summary),
    baselineSummary: String(row.baseline_summary), outcomesSummary: String(row.outcomes_summary), recommendations: String(row.recommendations),
    clientApproved: Boolean(row.client_approved), approvedBy: row.approved_by ? String(row.approved_by) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null, publishedAt: row.published_at ? String(row.published_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToOutcomeMetric(row: Row): OutcomeMetric {
  return {
    id: String(row.id), outcomeReportId: String(row.outcome_report_id), name: String(row.name), unit: String(row.unit),
    baselineValue: Number(row.baseline_value), currentValue: Number(row.current_value), targetValue: row.target_value === null ? null : Number(row.target_value),
    direction: row.direction as OutcomeMetric["direction"], evidenceSource: String(row.evidence_source), verified: Boolean(row.verified),
    sortOrder: Number(row.sort_order), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToCaseStudy(row: Row): CaseStudy {
  return {
    id: String(row.id), outcomeReportId: String(row.outcome_report_id), slug: String(row.slug), title: String(row.title),
    clientDisplayName: String(row.client_display_name), industry: String(row.industry), summary: String(row.summary), challenge: String(row.challenge),
    intervention: String(row.intervention), result: String(row.result), evidenceNote: String(row.evidence_note), status: row.status as CaseStudy["status"],
    featured: Boolean(row.featured), publicationConsent: Boolean(row.publication_consent), publishedAt: row.published_at ? String(row.published_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToTestimonial(row: Row): Testimonial {
  return {
    id: String(row.id), accountId: row.account_id ? String(row.account_id) : null, caseStudyId: row.case_study_id ? String(row.case_study_id) : null,
    quote: String(row.quote), attributionName: String(row.attribution_name), attributionTitle: String(row.attribution_title),
    attributionCompany: String(row.attribution_company), permission: row.permission as Testimonial["permission"], source: String(row.source),
    status: row.status as Testimonial["status"], collectedAt: String(row.collected_at), publishedAt: row.published_at ? String(row.published_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToRoleSpecialisation(row: Row): RoleSpecialisation {
  return {
    id: String(row.id), slug: String(row.slug), name: String(row.name), operatorType: row.operator_type as RoleSpecialisation["operatorType"],
    targetDepartment: String(row.target_department), promise: String(row.promise),
    responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities.map(String) : [], approvedTools: Array.isArray(row.approved_tools) ? row.approved_tools.map(String) : [],
    successMetrics: Array.isArray(row.success_metrics) ? row.success_metrics.map(String) : [], readinessRequirements: String(row.readiness_requirements),
    targetHoursSavedMonth: Number(row.target_hours_saved_month), status: row.status as RoleSpecialisation["status"],
    ownerId: row.owner_id ? String(row.owner_id) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToPartnership(row: Row): Partnership {
  return {
    id: String(row.id), organizationName: String(row.organization_name), type: row.type as Partnership["type"], status: row.status as Partnership["status"],
    contactName: String(row.contact_name), contactEmail: String(row.contact_email), contactPhone: String(row.contact_phone), website: String(row.website),
    valueProposition: String(row.value_proposition), nextStep: String(row.next_step), nextStepDueAt: row.next_step_due_at ? String(row.next_step_due_at) : null,
    ownerId: row.owner_id ? String(row.owner_id) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToPartnerReferral(row: Row): PartnerReferral {
  return {
    id: String(row.id), partnershipId: String(row.partnership_id), accountId: row.account_id ? String(row.account_id) : null,
    opportunityId: row.opportunity_id ? String(row.opportunity_id) : null, contactName: String(row.contact_name), companyName: String(row.company_name),
    status: row.status as PartnerReferral["status"], estimatedValueAed: Number(row.estimated_value_aed), notes: String(row.notes),
    referredAt: String(row.referred_at), convertedAt: row.converted_at ? String(row.converted_at) : null,
    createdBy: row.created_by ? String(row.created_by) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}

function rowToRepeatabilityBenchmark(row: Row): RepeatabilityBenchmark {
  return {
    id: String(row.id), specialisationId: row.specialisation_id ? String(row.specialisation_id) : null,
    engagementType: row.engagement_type as RepeatabilityBenchmark["engagementType"], industry: String(row.industry), metricName: String(row.metric_name),
    unit: String(row.unit), sampleSize: Number(row.sample_size), medianBaseline: Number(row.median_baseline), medianResult: Number(row.median_result),
    improvementPercent: Number(row.improvement_percent), evidenceThreshold: Number(row.evidence_threshold), status: row.status as RepeatabilityBenchmark["status"],
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null, reviewedAt: row.reviewed_at ? String(row.reviewed_at) : null,
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

function workforceOperatorToRow(item: WorkforceOperator) {
  return { id: item.id, profile_id: item.profileId, application_id: item.applicationId, credential_id: item.credentialId, operator_number: item.operatorNumber, full_name: item.fullName, email: item.email, phone: item.phone, location: item.location, operator_type: item.operatorType, status: item.status, work_mode: item.workMode, specialisation: item.specialisation, skills: item.skills, experience_summary: item.experienceSummary, readiness_score: item.readinessScore, monthly_cost_aed: item.monthlyCostAed, capacity_hours_month: item.capacityHoursMonth, available_from: item.availableFrom, background_check_complete: item.backgroundCheckComplete, nda_signed_at: item.ndaSignedAt, data_policy_signed_at: item.dataPolicySignedAt, owner_id: item.ownerId, created_at: item.createdAt, updated_at: item.updatedAt };
}

function operatorOnboardingItemToRow(item: OperatorOnboardingItem) {
  return { id: item.id, operator_id: item.operatorId, task_key: item.taskKey, label: item.label, category: item.category, status: item.status, due_date: item.dueDate, completed_at: item.completedAt, completed_by: item.completedBy, notes: item.notes, sort_order: item.sortOrder, created_at: item.createdAt, updated_at: item.updatedAt };
}

function workforceMatchToRow(item: WorkforceMatch) {
  return { id: item.id, operator_id: item.operatorId, account_id: item.accountId, opportunity_id: item.opportunityId, role_title: item.roleTitle, status: item.status, match_score: item.matchScore, proposed_rate_aed: item.proposedRateAed, rationale: item.rationale, client_requirements: item.clientRequirements, submitted_at: item.submittedAt, decided_at: item.decidedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function workforceDeploymentToRow(item: WorkforceDeployment) {
  return { id: item.id, deployment_number: item.deploymentNumber, match_id: item.matchId, operator_id: item.operatorId, account_id: item.accountId, opportunity_id: item.opportunityId, plan: item.plan, role_title: item.roleTitle, status: item.status, starts_on: item.startsOn, ends_on: item.endsOn, minimum_term_months: item.minimumTermMonths, client_rate_monthly_aed: item.clientRateMonthlyAed, operator_cost_monthly_aed: item.operatorCostMonthlyAed, management_allocation_aed: item.managementAllocationAed, tools_overhead_aed: item.toolsOverheadAed, target_hours_month: item.targetHoursMonth, account_manager_id: item.accountManagerId, client_owner_name: item.clientOwnerName, client_owner_email: item.clientOwnerEmail, outcomes: item.outcomes, success_measures: item.successMeasures, next_review_at: item.nextReviewAt, ended_at: item.endedAt, created_at: item.createdAt, updated_at: item.updatedAt };
}

function clientSopToRow(item: ClientSop) {
  return { id: item.id, deployment_id: item.deploymentId, title: item.title, department: item.department, version: item.version, status: item.status, risk_level: item.riskLevel, purpose: item.purpose, approved_tools: item.approvedTools, inputs: item.inputs, procedure: item.procedure, review_criteria: item.reviewCriteria, data_controls: item.dataControls, human_approver: item.humanApprover, approved_by: item.approvedBy, approved_at: item.approvedAt, created_at: item.createdAt, updated_at: item.updatedAt };
}

function operatorQualityReviewToRow(item: OperatorQualityReview) {
  return { id: item.id, deployment_id: item.deploymentId, operator_id: item.operatorId, review_date: item.reviewDate, period_start: item.periodStart, period_end: item.periodEnd, reviewer_id: item.reviewerId, quality_score: item.qualityScore, reliability_score: item.reliabilityScore, responsible_ai_score: item.responsibleAiScore, client_satisfaction_score: item.clientSatisfactionScore, utilisation_percent: item.utilisationPercent, hours_worked: item.hoursWorked, hours_saved: item.hoursSaved, risk_incidents: item.riskIncidents, client_feedback: item.clientFeedback, strengths: item.strengths, actions: item.actions, outcome: item.outcome, created_at: item.createdAt };
}

function outcomeReportToRow(item: OutcomeReport) {
  return { id: item.id, report_number: item.reportNumber, account_id: item.accountId, opportunity_id: item.opportunityId, deployment_id: item.deploymentId, cohort_id: item.cohortId, expansion_opportunity_id: item.expansionOpportunityId, title: item.title, engagement_type: item.engagementType, status: item.status, period_start: item.periodStart, period_end: item.periodEnd, executive_summary: item.executiveSummary, baseline_summary: item.baselineSummary, outcomes_summary: item.outcomesSummary, recommendations: item.recommendations, client_approved: item.clientApproved, approved_by: item.approvedBy, approved_at: item.approvedAt, published_at: item.publishedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function outcomeMetricToRow(item: OutcomeMetric) {
  return { id: item.id, outcome_report_id: item.outcomeReportId, name: item.name, unit: item.unit, baseline_value: item.baselineValue, current_value: item.currentValue, target_value: item.targetValue, direction: item.direction, evidence_source: item.evidenceSource, verified: item.verified, sort_order: item.sortOrder, created_at: item.createdAt, updated_at: item.updatedAt };
}

function caseStudyToRow(item: CaseStudy) {
  return { id: item.id, outcome_report_id: item.outcomeReportId, slug: item.slug, title: item.title, client_display_name: item.clientDisplayName, industry: item.industry, summary: item.summary, challenge: item.challenge, intervention: item.intervention, result: item.result, evidence_note: item.evidenceNote, status: item.status, featured: item.featured, publication_consent: item.publicationConsent, published_at: item.publishedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function testimonialToRow(item: Testimonial) {
  return { id: item.id, account_id: item.accountId, case_study_id: item.caseStudyId, quote: item.quote, attribution_name: item.attributionName, attribution_title: item.attributionTitle, attribution_company: item.attributionCompany, permission: item.permission, source: item.source, status: item.status, collected_at: item.collectedAt, published_at: item.publishedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function roleSpecialisationToRow(item: RoleSpecialisation) {
  return { id: item.id, slug: item.slug, name: item.name, operator_type: item.operatorType, target_department: item.targetDepartment, promise: item.promise, responsibilities: item.responsibilities, approved_tools: item.approvedTools, success_metrics: item.successMetrics, readiness_requirements: item.readinessRequirements, target_hours_saved_month: item.targetHoursSavedMonth, status: item.status, owner_id: item.ownerId, created_at: item.createdAt, updated_at: item.updatedAt };
}

function partnershipToRow(item: Partnership) {
  return { id: item.id, organization_name: item.organizationName, type: item.type, status: item.status, contact_name: item.contactName, contact_email: item.contactEmail, contact_phone: item.contactPhone, website: item.website, value_proposition: item.valueProposition, next_step: item.nextStep, next_step_due_at: item.nextStepDueAt, owner_id: item.ownerId, created_at: item.createdAt, updated_at: item.updatedAt };
}

function partnerReferralToRow(item: PartnerReferral) {
  return { id: item.id, partnership_id: item.partnershipId, account_id: item.accountId, opportunity_id: item.opportunityId, contact_name: item.contactName, company_name: item.companyName, status: item.status, estimated_value_aed: item.estimatedValueAed, notes: item.notes, referred_at: item.referredAt, converted_at: item.convertedAt, created_by: item.createdBy, created_at: item.createdAt, updated_at: item.updatedAt };
}

function repeatabilityBenchmarkToRow(item: RepeatabilityBenchmark) {
  return { id: item.id, specialisation_id: item.specialisationId, engagement_type: item.engagementType, industry: item.industry, metric_name: item.metricName, unit: item.unit, sample_size: item.sampleSize, median_baseline: item.medianBaseline, median_result: item.medianResult, improvement_percent: item.improvementPercent, evidence_threshold: item.evidenceThreshold, status: item.status, reviewed_by: item.reviewedBy, reviewed_at: item.reviewedAt, created_at: item.createdAt, updated_at: item.updatedAt };
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
  const [profilesResult, applicationsResult, cohortsResult, enrollmentsResult, modulesResult, cohortModulesResult, sessionsResult, attendanceResult, componentsResult, submissionsResult, resultsResult, credentialsResult, accountsResult, opportunitiesResult, readinessResult, workflowsResult, proposalsResult, workshopsResult, operatorsResult, onboardingResult, matchesResult, deploymentsResult, sopsResult, qualityResult, outcomeReportsResult, outcomeMetricsResult, caseStudiesResult, testimonialsResult, specialisationsResult, partnershipsResult, referralsResult, benchmarksResult, activitiesResult] = await Promise.all([
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
    client.from("workforce_operators").select("*").order("created_at", { ascending: false }),
    client.from("operator_onboarding_items").select("*").order("sort_order", { ascending: true }),
    client.from("workforce_matches").select("*").order("created_at", { ascending: false }),
    client.from("workforce_deployments").select("*").order("starts_on", { ascending: false }),
    client.from("client_sops").select("*").order("updated_at", { ascending: false }),
    client.from("operator_quality_reviews").select("*").order("review_date", { ascending: false }),
    client.from("outcome_reports").select("*").order("period_end", { ascending: false }),
    client.from("outcome_metrics").select("*").order("sort_order", { ascending: true }),
    client.from("case_studies").select("*").order("updated_at", { ascending: false }),
    client.from("testimonials").select("*").order("collected_at", { ascending: false }),
    client.from("role_specialisations").select("*").order("name", { ascending: true }),
    client.from("partnerships").select("*").order("updated_at", { ascending: false }),
    client.from("partner_referrals").select("*").order("referred_at", { ascending: false }),
    client.from("repeatability_benchmarks").select("*").order("sample_size", { ascending: false }),
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
  const operators = await requireRows("workforce_operators", operatorsResult);
  const onboarding = await requireRows("operator_onboarding_items", onboardingResult);
  const matches = await requireRows("workforce_matches", matchesResult);
  const deployments = await requireRows("workforce_deployments", deploymentsResult);
  const sops = await requireRows("client_sops", sopsResult);
  const quality = await requireRows("operator_quality_reviews", qualityResult);
  const outcomeReports = await requireRows("outcome_reports", outcomeReportsResult);
  const outcomeMetrics = await requireRows("outcome_metrics", outcomeMetricsResult);
  const caseStudies = await requireRows("case_studies", caseStudiesResult);
  const testimonials = await requireRows("testimonials", testimonialsResult);
  const specialisations = await requireRows("role_specialisations", specialisationsResult);
  const partnerships = await requireRows("partnerships", partnershipsResult);
  const referrals = await requireRows("partner_referrals", referralsResult);
  const benchmarks = await requireRows("repeatability_benchmarks", benchmarksResult);
  const activities = await requireRows("activities", activitiesResult);
  return {
    users: profiles.map(profileToUser), sessions: [], applications: applications.map(rowToApplication), cohorts: cohorts.map(rowToCohort),
    enrollments: enrollments.map(rowToEnrollment), learningModules: modules.map(rowToLearningModule), cohortModules: cohortModules.map(rowToCohortModule),
    cohortSessions: sessions.map(rowToCohortSession), attendanceRecords: attendance.map(rowToAttendance), assessmentComponents: components.map(rowToAssessmentComponent),
    assessmentSubmissions: submissions.map(rowToAssessmentSubmission), assessmentResults: results.map(rowToAssessmentResult), credentials: credentials.map(rowToCredential),
    corporateAccounts: accounts.map(rowToCorporateAccount), corporateOpportunities: opportunities.map(rowToCorporateOpportunity),
    readinessAssessments: readiness.map(rowToReadinessAssessment), workflowOpportunities: workflows.map(rowToWorkflowOpportunity),
    corporateProposals: proposals.map(rowToCorporateProposal), corporateWorkshops: workshops.map(rowToCorporateWorkshop),
    workforceOperators: operators.map(rowToWorkforceOperator), operatorOnboardingItems: onboarding.map(rowToOperatorOnboardingItem),
    workforceMatches: matches.map(rowToWorkforceMatch), workforceDeployments: deployments.map(rowToWorkforceDeployment),
    clientSops: sops.map(rowToClientSop), operatorQualityReviews: quality.map(rowToOperatorQualityReview),
    outcomeReports: outcomeReports.map(rowToOutcomeReport), outcomeMetrics: outcomeMetrics.map(rowToOutcomeMetric),
    caseStudies: caseStudies.map(rowToCaseStudy), testimonials: testimonials.map(rowToTestimonial),
    roleSpecialisations: specialisations.map(rowToRoleSpecialisation), partnerships: partnerships.map(rowToPartnership),
    partnerReferrals: referrals.map(rowToPartnerReferral), repeatabilityBenchmarks: benchmarks.map(rowToRepeatabilityBenchmark),
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
  await upsertRows("workforce_operators", changedItems(before.workforceOperators, after.workforceOperators).map(workforceOperatorToRow));
  await upsertRows("operator_onboarding_items", changedItems(before.operatorOnboardingItems, after.operatorOnboardingItems).map(operatorOnboardingItemToRow));
  await upsertRows("workforce_matches", changedItems(before.workforceMatches, after.workforceMatches).map(workforceMatchToRow));
  await upsertRows("workforce_deployments", changedItems(before.workforceDeployments, after.workforceDeployments).map(workforceDeploymentToRow));
  await upsertRows("client_sops", changedItems(before.clientSops, after.clientSops).map(clientSopToRow));
  await upsertRows("operator_quality_reviews", changedItems(before.operatorQualityReviews, after.operatorQualityReviews).map(operatorQualityReviewToRow));
  await upsertRows("outcome_reports", changedItems(before.outcomeReports, after.outcomeReports).map(outcomeReportToRow));
  await upsertRows("outcome_metrics", changedItems(before.outcomeMetrics, after.outcomeMetrics).map(outcomeMetricToRow));
  await upsertRows("case_studies", changedItems(before.caseStudies, after.caseStudies).map(caseStudyToRow));
  await upsertRows("testimonials", changedItems(before.testimonials, after.testimonials).map(testimonialToRow));
  await upsertRows("role_specialisations", changedItems(before.roleSpecialisations, after.roleSpecialisations).map(roleSpecialisationToRow));
  await upsertRows("partnerships", changedItems(before.partnerships, after.partnerships).map(partnershipToRow));
  await upsertRows("partner_referrals", changedItems(before.partnerReferrals, after.partnerReferrals).map(partnerReferralToRow));
  await upsertRows("repeatability_benchmarks", changedItems(before.repeatabilityBenchmarks, after.repeatabilityBenchmarks).map(repeatabilityBenchmarkToRow));
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
