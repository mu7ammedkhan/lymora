import { mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import type { Application, CaseStudy, ClientSop, Cohort, CorporateAccount, CorporateOpportunity, CorporateProposal, CorporateWorkshop, DatabaseSchema, Enrollment, OperatorOnboardingItem, OperatorQualityReview, OutcomeMetric, OutcomeReport, PartnerReferral, Partnership, ReadinessAssessment, RepeatabilityBenchmark, RoleSpecialisation, Testimonial, User, WorkforceDeployment, WorkforceMatch, WorkforceOperator, WorkflowOpportunity } from "@/lib/os/types";
import { assertSupabaseConfiguration, wantsSupabase } from "@/lib/supabase/config";
import { readSupabaseDatabase, updateSupabaseDatabase } from "@/lib/os/supabase-store";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "lymora-os.json");

const emptyDatabase: DatabaseSchema = {
  users: [],
  sessions: [],
  applications: [],
  cohorts: [],
  enrollments: [],
  learningModules: [],
  cohortModules: [],
  cohortSessions: [],
  attendanceRecords: [],
  assessmentComponents: [],
  assessmentSubmissions: [],
  assessmentResults: [],
  credentials: [],
  corporateAccounts: [],
  corporateOpportunities: [],
  readinessAssessments: [],
  workflowOpportunities: [],
  corporateProposals: [],
  corporateWorkshops: [],
  workforceOperators: [],
  operatorOnboardingItems: [],
  workforceMatches: [],
  workforceDeployments: [],
  clientSops: [],
  operatorQualityReviews: [],
  outcomeReports: [],
  outcomeMetrics: [],
  caseStudies: [],
  testimonials: [],
  roleSpecialisations: [],
  partnerships: [],
  partnerReferrals: [],
  repeatabilityBenchmarks: [],
  activities: [],
};

const seedApplications: Application[] = [
  {
    id: "app-aisha",
    number: "CAIO-26071",
    fullName: "Aisha Rahman",
    email: "aisha@example.com",
    phone: "+971 50 555 0142",
    location: "Dubai, UAE",
    currentRole: "Operations Manager",
    industry: "Professional Services",
    experience: "6-10 years",
    aiLevel: "Regular user",
    track: "Operations",
    workflowGoal: "Build a controlled reporting and operating review workflow for a distributed team.",
    motivation: "I am responsible for making AI adoption practical across our operations team.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "https://linkedin.com",
    status: "interview",
    score: 86,
    notes: "Strong operating background. Explore leadership scope during interview.",
    source: "website",
    reviewedBy: "user-admin",
    createdAt: "2026-07-18T08:20:00.000Z",
    updatedAt: "2026-07-19T06:15:00.000Z",
  },
  {
    id: "app-omar",
    number: "CAIO-26072",
    fullName: "Omar Al Mansoori",
    email: "omar@example.com",
    phone: "+971 55 555 0171",
    location: "Abu Dhabi, UAE",
    currentRole: "Executive Assistant",
    industry: "Investment",
    experience: "2-5 years",
    aiLevel: "Already building workflows",
    track: "Executive support",
    workflowGoal: "Create verified executive briefing and meeting intelligence systems.",
    motivation: "I want to move from ad hoc prompting to accountable executive workflows.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes, with a payment plan",
    linkedinUrl: "",
    status: "screening",
    score: 79,
    notes: "Portfolio evidence requested.",
    source: "referral",
    reviewedBy: "user-academy",
    createdAt: "2026-07-18T10:12:00.000Z",
    updatedAt: "2026-07-19T07:05:00.000Z",
  },
  {
    id: "app-leila",
    number: "CAIO-26073",
    fullName: "Leila Haddad",
    email: "leila@example.com",
    phone: "+971 52 555 0198",
    location: "Dubai, UAE",
    currentRole: "Marketing Lead",
    industry: "Hospitality",
    experience: "6-10 years",
    aiLevel: "Regular user",
    track: "Marketing and content",
    workflowGoal: "Operationalise multilingual campaign production with brand and human review controls.",
    motivation: "Our team needs repeatable quality, not more disconnected tools.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "",
    status: "accepted",
    score: 91,
    notes: "Accepted for Cohort 01.",
    source: "website",
    reviewedBy: "user-admin",
    createdAt: "2026-07-16T11:10:00.000Z",
    updatedAt: "2026-07-18T13:30:00.000Z",
  },
  {
    id: "app-samuel",
    number: "CAIO-26074",
    fullName: "Samuel Okoye",
    email: "samuel@example.com",
    phone: "+971 54 555 0164",
    location: "Dubai, UAE",
    currentRole: "Sales Operations Specialist",
    industry: "Technology",
    experience: "2-5 years",
    aiLevel: "Occasional user",
    track: "Sales and research",
    workflowGoal: "Improve account research, preparation and CRM follow-through.",
    motivation: "I want an assessed operating standard for client-facing AI work.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "",
    status: "new",
    score: null,
    notes: "",
    source: "website",
    reviewedBy: null,
    createdAt: "2026-07-19T05:42:00.000Z",
    updatedAt: "2026-07-19T05:42:00.000Z",
  },
  {
    id: "app-noor",
    number: "CAIO-26075",
    fullName: "Noor Siddiqui",
    email: "noor@example.com",
    phone: "+971 58 555 0105",
    location: "Sharjah, UAE",
    currentRole: "Customer Experience Manager",
    industry: "Retail",
    experience: "6-10 years",
    aiLevel: "Regular user",
    track: "Customer experience",
    workflowGoal: "Create a response quality and knowledge maintenance operating system.",
    motivation: "I need to lead responsible AI adoption without lowering service quality.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "",
    status: "new",
    score: null,
    notes: "",
    source: "website",
    reviewedBy: null,
    createdAt: "2026-07-19T04:14:00.000Z",
    updatedAt: "2026-07-19T04:14:00.000Z",
  },
  {
    id: "app-daniel",
    number: "CAIO-26076",
    fullName: "Daniel Kim",
    email: "daniel@example.com",
    phone: "+971 56 555 0188",
    location: "Dubai, UAE",
    currentRole: "Founder Associate",
    industry: "Financial Services",
    experience: "2-5 years",
    aiLevel: "Already building workflows",
    track: "Operations",
    workflowGoal: "Develop secure research and investment memo workflows.",
    motivation: "The credential would formalise the work I already do and expose my blind spots.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "",
    status: "screening",
    score: 83,
    notes: "Check employer approval for live schedule.",
    source: "manual",
    reviewedBy: "user-academy",
    createdAt: "2026-07-15T09:50:00.000Z",
    updatedAt: "2026-07-18T14:12:00.000Z",
  },
  {
    id: "app-fatima",
    number: "CAIO-26077",
    fullName: "Fatima Zahra",
    email: "fatima@example.com",
    phone: "+971 50 555 0133",
    location: "Dubai, UAE",
    currentRole: "People Operations Partner",
    industry: "Healthcare",
    experience: "6-10 years",
    aiLevel: "Occasional user",
    track: "HR and recruitment",
    workflowGoal: "Create documented recruitment administration while preserving human hiring decisions.",
    motivation: "Responsible use is becoming an immediate requirement in our people function.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes, with a payment plan",
    linkedinUrl: "",
    status: "interview",
    score: 88,
    notes: "Excellent governance orientation.",
    source: "website",
    reviewedBy: "user-admin",
    createdAt: "2026-07-14T13:25:00.000Z",
    updatedAt: "2026-07-18T12:46:00.000Z",
  },
  {
    id: "app-maya",
    number: "CAIO-26078",
    fullName: "Maya Chen",
    email: "maya@example.com",
    phone: "+971 55 555 0157",
    location: "Dubai, UAE",
    currentRole: "Research Associate",
    industry: "Consulting",
    experience: "2-5 years",
    aiLevel: "Regular user",
    track: "Sales and research",
    workflowGoal: "Improve evidence-led market research and human verification.",
    motivation: "I want to become deployment-ready for AI-enabled client work.",
    scheduleCommitment: "Yes",
    investmentReadiness: "Yes",
    linkedinUrl: "",
    status: "accepted",
    score: 93,
    notes: "Accepted for Cohort 01.",
    source: "referral",
    reviewedBy: "user-admin",
    createdAt: "2026-07-13T08:40:00.000Z",
    updatedAt: "2026-07-17T16:20:00.000Z",
  },
  {
    id: "app-youssef",
    number: "CAIO-26079",
    fullName: "Youssef Nasser",
    email: "youssef@example.com",
    phone: "+971 52 555 0122",
    location: "Ajman, UAE",
    currentRole: "Account Executive",
    industry: "Real Estate",
    experience: "2-5 years",
    aiLevel: "New to workplace AI",
    track: "Sales and research",
    workflowGoal: "Automate all outbound sales activity.",
    motivation: "I want to learn more tools.",
    scheduleCommitment: "I need to confirm the schedule",
    investmentReadiness: "No",
    linkedinUrl: "",
    status: "waitlisted",
    score: 58,
    notes: "Revisit when schedule and investment readiness are confirmed.",
    source: "website",
    reviewedBy: "user-academy",
    createdAt: "2026-07-12T14:30:00.000Z",
    updatedAt: "2026-07-17T09:10:00.000Z",
  },
  {
    id: "app-rania",
    number: "CAIO-26080",
    fullName: "Rania Salem",
    email: "rania@example.com",
    phone: "+971 54 555 0116",
    location: "Dubai, UAE",
    currentRole: "Office Coordinator",
    industry: "Construction",
    experience: "Less than 2 years",
    aiLevel: "New to workplace AI",
    track: "Executive support",
    workflowGoal: "Use AI for emails and scheduling.",
    motivation: "I would like a certificate for career development.",
    scheduleCommitment: "No",
    investmentReadiness: "No",
    linkedinUrl: "",
    status: "declined",
    score: 42,
    notes: "Does not currently meet commitment criteria.",
    source: "website",
    reviewedBy: "user-academy",
    createdAt: "2026-07-11T10:05:00.000Z",
    updatedAt: "2026-07-16T08:25:00.000Z",
  },
];

const seedCohorts: Cohort[] = [
  {
    id: "cohort-caio-01",
    code: "CAIO-01",
    name: "CAIO Founding Cohort",
    program: "Certified AI Operations Professional",
    startDate: "2026-08-17",
    endDate: "2026-09-20",
    schedule: "Mon & Thu, 7:00-9:00 PM GST",
    capacity: 24,
    status: "enrolling",
    createdAt: "2026-07-10T09:00:00.000Z",
  },
  {
    id: "cohort-caio-02",
    code: "CAIO-02",
    name: "CAIO Autumn Cohort",
    program: "Certified AI Operations Professional",
    startDate: "2026-10-05",
    endDate: "2026-11-08",
    schedule: "Tue & Sat, blended delivery",
    capacity: 30,
    status: "draft",
    createdAt: "2026-07-17T09:00:00.000Z",
  },
];

const seedEnrollments: Enrollment[] = [
  { id: "enroll-leila", cohortId: "cohort-caio-01", applicationId: "app-leila", status: "enrolled", progress: 8, createdAt: "2026-07-18T13:35:00.000Z" },
  { id: "enroll-maya", cohortId: "cohort-caio-01", applicationId: "app-maya", status: "invited", progress: 0, createdAt: "2026-07-17T16:25:00.000Z" },
];

const seedCorporateAccounts: CorporateAccount[] = [
  { id: "b1000000-0000-4000-8000-000000000001", companyName: "Northstar Advisory", website: "https://example.com", industry: "Professional Services", employeeBand: "51-100", location: "Dubai, UAE", primaryContactName: "Samira Noor", primaryContactEmail: "samira@example.com", primaryContactPhone: "+971 50 000 1101", primaryContactTitle: "Chief Operating Officer", ownerId: "user-admin", source: "Executive roundtable", status: "active", notes: "Sample account for product demonstration.", createdAt: "2026-07-05T09:00:00.000Z", updatedAt: "2026-07-18T09:00:00.000Z" },
  { id: "b1000000-0000-4000-8000-000000000002", companyName: "Meridian Clinics Group", website: "https://example.com", industry: "Healthcare", employeeBand: "101-200", location: "Abu Dhabi, UAE", primaryContactName: "Omar Rahal", primaryContactEmail: "omar@example.com", primaryContactPhone: "+971 50 000 1102", primaryContactTitle: "Director of Operations", ownerId: "user-admin", source: "Referral", status: "prospect", notes: "Sample account for product demonstration.", createdAt: "2026-07-08T09:00:00.000Z", updatedAt: "2026-07-17T09:00:00.000Z" },
  { id: "b1000000-0000-4000-8000-000000000003", companyName: "Harbourline Properties", website: "https://example.com", industry: "Real Estate", employeeBand: "21-50", location: "Dubai, UAE", primaryContactName: "Layla Darwish", primaryContactEmail: "layla@example.com", primaryContactPhone: "+971 50 000 1103", primaryContactTitle: "Managing Director", ownerId: "user-admin", source: "Website", status: "prospect", notes: "Sample account for product demonstration.", createdAt: "2026-07-11T09:00:00.000Z", updatedAt: "2026-07-19T08:00:00.000Z" },
];

const seedCorporateOpportunities: CorporateOpportunity[] = [
  { id: "b2000000-0000-4000-8000-000000000001", accountId: seedCorporateAccounts[0].id, title: "Operations AI enablement pilot", package: "team_enablement_15", participantCount: 15, stage: "proposal", valueAed: 12500, probability: 65, expectedCloseDate: "2026-08-07", nextStep: "Review proposal with COO", nextStepDueAt: "2026-07-23", ownerId: "user-admin", lostReason: "", createdAt: "2026-07-05T09:00:00.000Z", updatedAt: "2026-07-18T09:00:00.000Z" },
  { id: "b2000000-0000-4000-8000-000000000002", accountId: seedCorporateAccounts[1].id, title: "Executive readiness and workflow audit", package: "team_enablement_30", participantCount: 30, stage: "diagnosis", valueAed: 22500, probability: 45, expectedCloseDate: "2026-08-21", nextStep: "Run executive readiness session", nextStepDueAt: "2026-07-28", ownerId: "user-admin", lostReason: "", createdAt: "2026-07-08T09:00:00.000Z", updatedAt: "2026-07-17T09:00:00.000Z" },
  { id: "b2000000-0000-4000-8000-000000000003", accountId: seedCorporateAccounts[2].id, title: "Sales and leasing workflow lab", package: "team_enablement_15", participantCount: 12, stage: "qualified", valueAed: 12500, probability: 25, expectedCloseDate: "2026-09-04", nextStep: "Confirm department workflow owners", nextStepDueAt: "2026-07-25", ownerId: "user-admin", lostReason: "", createdAt: "2026-07-11T09:00:00.000Z", updatedAt: "2026-07-19T08:00:00.000Z" },
];

const seedReadinessAssessments: ReadinessAssessment[] = [
  { id: "b3000000-0000-4000-8000-000000000001", opportunityId: seedCorporateOpportunities[0].id, status: "completed", respondentName: "Samira Noor", leadershipScore: 72, peopleScore: 61, processScore: 74, dataScore: 55, toolsScore: 68, governanceScore: 42, adoptionScore: 57, overallScore: 61, maturity: "ready", executiveSummary: "Strong operational ownership and repeatable workflows create a credible pilot path. Governance and approved data handling need to be established before wider deployment.", priorities: "Set approved-use policy; pilot two high-volume workflows; train managers on human oversight.", risks: "Unapproved tools and inconsistent review of client-facing output.", completedAt: "2026-07-16T12:00:00.000Z", createdAt: "2026-07-12T09:00:00.000Z", updatedAt: "2026-07-16T12:00:00.000Z" },
];

const seedWorkflowOpportunities: WorkflowOpportunity[] = [
  { id: "b4000000-0000-4000-8000-000000000001", readinessAssessmentId: seedReadinessAssessments[0].id, workflowName: "Weekly client reporting", department: "Operations", currentPain: "Six hours of manual synthesis every week", frequency: "Weekly", valueScore: 88, feasibilityScore: 82, riskLevel: "amber", humanOversight: "Account lead approves every client-facing report", recommendation: "Pilot with approved source folders and a fixed review checklist", priority: 1, createdAt: "2026-07-16T12:00:00.000Z" },
  { id: "b4000000-0000-4000-8000-000000000002", readinessAssessmentId: seedReadinessAssessments[0].id, workflowName: "Proposal first draft", department: "Growth", currentPain: "Senior staff recreate standard sections", frequency: "10-15 per month", valueScore: 78, feasibilityScore: 76, riskLevel: "amber", humanOversight: "Commercial owner validates claims, scope and pricing", recommendation: "Create controlled template and instruction library", priority: 2, createdAt: "2026-07-16T12:00:00.000Z" },
];

const seedCorporateProposals: CorporateProposal[] = [
  { id: "b5000000-0000-4000-8000-000000000001", opportunityId: seedCorporateOpportunities[0].id, proposalNumber: "LYM-P-26001", package: "team_enablement_15", participantCount: 15, subtotalAed: 12500, vatRate: 5, vatAed: 625, totalAed: 13125, scope: "AI readiness assessment and workflow audit\nCustomised live training and role-specific instruction library\nDepartment AI playbook and 30-day implementation plan\nManager coaching, certificates and outcome report", timeline: "Four weeks from kickoff", assumptions: "Training fees payable in advance. Software, travel and major customisation are excluded.", status: "sent", validUntil: "2026-08-07", sentAt: "2026-07-18T09:00:00.000Z", acceptedAt: null, createdBy: "user-admin", createdAt: "2026-07-18T08:00:00.000Z", updatedAt: "2026-07-18T09:00:00.000Z" },
];

const seedCorporateWorkshops: CorporateWorkshop[] = [
  { id: "b6000000-0000-4000-8000-000000000001", opportunityId: seedCorporateOpportunities[1].id, proposalId: null, title: "Executive AI readiness session", workshopType: "executive_readiness", startsAt: "2026-07-28T06:00:00.000Z", endsAt: "2026-07-28T08:00:00.000Z", deliveryMode: "in_person", location: "Abu Dhabi", joinUrl: "", status: "confirmed", facilitator: "Lymora Advisory", participantTarget: 8, outcomes: "Agree readiness baseline and select priority departments.", notes: "Sample workshop for product demonstration.", createdAt: "2026-07-17T09:00:00.000Z", updatedAt: "2026-07-17T09:00:00.000Z" },
  { id: "b6000000-0000-4000-8000-000000000002", opportunityId: seedCorporateOpportunities[0].id, proposalId: seedCorporateProposals[0].id, title: "Operations workflow lab", workshopType: "workflow_lab", startsAt: "2026-08-12T05:00:00.000Z", endsAt: "2026-08-12T08:00:00.000Z", deliveryMode: "hybrid", location: "Dubai", joinUrl: "https://meet.example.com/lymora", status: "planned", facilitator: "Lymora Enablement", participantTarget: 15, outcomes: "Build and validate two HITL workflows.", notes: "Subject to proposal acceptance.", createdAt: "2026-07-18T09:00:00.000Z", updatedAt: "2026-07-18T09:00:00.000Z" },
];

const seedWorkforceOperators: WorkforceOperator[] = [
  { id: "c1000000-0000-4000-8000-000000000001", profileId: null, applicationId: "app-aisha", credentialId: null, operatorNumber: "LYM-OP-26001", fullName: "Aisha Rahman", email: "aisha.operator@example.com", phone: "+971 50 555 0142", location: "Dubai, UAE", operatorType: "operations", status: "deployed", workMode: "hybrid", specialisation: "Operational reporting and workflow governance", skills: ["Process mapping", "Executive reporting", "SOP design", "Human-in-the-loop review"], experienceSummary: "Operations leader experienced in turning recurring management work into controlled, measurable systems.", readinessScore: 88, monthlyCostAed: 5000, capacityHoursMonth: 160, availableFrom: "2026-07-14", backgroundCheckComplete: true, ndaSignedAt: "2026-07-10T09:00:00.000Z", dataPolicySignedAt: "2026-07-10T09:15:00.000Z", ownerId: "user-admin", createdAt: "2026-07-07T09:00:00.000Z", updatedAt: "2026-07-14T09:00:00.000Z" },
  { id: "c1000000-0000-4000-8000-000000000002", profileId: null, applicationId: "app-maya", credentialId: null, operatorNumber: "LYM-OP-26002", fullName: "Maya Chen", email: "maya.operator@example.com", phone: "+971 55 555 0157", location: "Dubai, UAE", operatorType: "sales", status: "available", workMode: "remote", specialisation: "Evidence-led account research and sales intelligence", skills: ["Market research", "Source verification", "CRM workflows", "Sales briefs"], experienceSummary: "Research associate with strong verification discipline and client-ready analytical writing.", readinessScore: 92, monthlyCostAed: 5500, capacityHoursMonth: 160, availableFrom: "2026-07-21", backgroundCheckComplete: true, ndaSignedAt: "2026-07-11T08:00:00.000Z", dataPolicySignedAt: "2026-07-11T08:15:00.000Z", ownerId: "user-admin", createdAt: "2026-07-09T09:00:00.000Z", updatedAt: "2026-07-19T10:00:00.000Z" },
];

const onboardingTasks = [
  ["identity", "Identity and right-to-work verification", "Compliance"],
  ["background", "Background and reference screening", "Compliance"],
  ["credential", "Capability evidence and credential review", "Capability"],
  ["nda", "Confidentiality agreement", "Compliance"],
  ["data_policy", "Client data and responsible-AI policy", "Governance"],
  ["tools", "Approved tool access and security setup", "Systems"],
  ["role_playbook", "Client role playbook and workflow rehearsal", "Delivery"],
] as const;

const seedOperatorOnboardingItems: OperatorOnboardingItem[] = seedWorkforceOperators.flatMap((operator) => onboardingTasks.map(([taskKey, label, category], index) => ({
  id: `onboarding-${operator.operatorNumber}-${index + 1}`, operatorId: operator.id, taskKey, label, category, status: "complete" as const,
  dueDate: "2026-07-18", completedAt: "2026-07-18T09:00:00.000Z", completedBy: "user-admin", notes: "", sortOrder: (index + 1) * 10,
  createdAt: "2026-07-10T09:00:00.000Z", updatedAt: "2026-07-18T09:00:00.000Z",
})));

const seedWorkforceMatches: WorkforceMatch[] = [
  { id: "c3000000-0000-4000-8000-000000000001", operatorId: seedWorkforceOperators[0].id, accountId: seedCorporateAccounts[0].id, opportunityId: seedCorporateOpportunities[0].id, roleTitle: "AI Operations Operator", status: "approved", matchScore: 94, proposedRateAed: 9000, rationale: "Strong process ownership, reporting discipline and governance fit.", clientRequirements: "Build weekly operating reviews, maintain SOPs and keep human approval on client-facing outputs.", submittedAt: "2026-07-09T09:00:00.000Z", decidedAt: "2026-07-11T12:00:00.000Z", createdBy: "user-admin", createdAt: "2026-07-09T09:00:00.000Z", updatedAt: "2026-07-11T12:00:00.000Z" },
];

const seedWorkforceDeployments: WorkforceDeployment[] = [
  { id: "c4000000-0000-4000-8000-000000000001", deploymentNumber: "LYM-DEP-26001", matchId: seedWorkforceMatches[0].id, operatorId: seedWorkforceOperators[0].id, accountId: seedCorporateAccounts[0].id, opportunityId: seedCorporateOpportunities[0].id, plan: "starter", roleTitle: "AI Operations Operator", status: "active", startsOn: "2026-07-14", endsOn: null, minimumTermMonths: 3, clientRateMonthlyAed: 9000, operatorCostMonthlyAed: 5000, managementAllocationAed: 1000, toolsOverheadAed: 500, targetHoursMonth: 160, accountManagerId: "user-admin", clientOwnerName: "Samira Noor", clientOwnerEmail: "samira@example.com", outcomes: "Establish reliable operating-review and management-reporting workflows.", successMeasures: "Reduce reporting preparation time, reach 80% workflow adoption and maintain zero material data incidents.", nextReviewAt: "2026-08-01T09:00:00.000Z", endedAt: null, createdAt: "2026-07-11T12:00:00.000Z", updatedAt: "2026-07-14T09:00:00.000Z" },
];

const seedClientSops: ClientSop[] = [
  { id: "c5000000-0000-4000-8000-000000000001", deploymentId: seedWorkforceDeployments[0].id, title: "Weekly operating review", department: "Operations", version: 1, status: "approved", riskLevel: "amber", purpose: "Prepare a verified weekly operating brief for leadership.", approvedTools: ["Approved AI workspace", "Google Drive", "Google Sheets"], inputs: "Approved KPI sheet, department updates and action register.", procedure: "Confirm the reporting period and approved sources. Verify quantitative claims. Mark assumptions. Route the brief to the COO for approval.", reviewCriteria: "Figures reconcile to sources, owners and due dates are explicit, and assumptions are labelled.", dataControls: "Use only the approved client workspace and never enter sensitive data into unapproved tools.", humanApprover: "Chief Operating Officer", approvedBy: "user-admin", approvedAt: "2026-07-13T12:00:00.000Z", createdAt: "2026-07-12T09:00:00.000Z", updatedAt: "2026-07-13T12:00:00.000Z" },
];

const seedOperatorQualityReviews: OperatorQualityReview[] = [
  { id: "c6000000-0000-4000-8000-000000000001", deploymentId: seedWorkforceDeployments[0].id, operatorId: seedWorkforceOperators[0].id, reviewDate: "2026-07-18", periodStart: "2026-07-14", periodEnd: "2026-07-18", reviewerId: "user-admin", qualityScore: 91, reliabilityScore: 94, responsibleAiScore: 96, clientSatisfactionScore: 90, utilisationPercent: 72, hoursWorked: 29, hoursSaved: 11, riskIncidents: 0, clientFeedback: "The first operating brief was clear, traceable and materially faster to review.", strengths: "Strong verification, stakeholder communication and approval routing.", actions: "Clarify missing KPI inputs earlier and document the exception path.", outcome: "on_track", createdAt: "2026-07-18T14:00:00.000Z" },
];

const seedOutcomeReports: OutcomeReport[] = [
  {
    id: "d1000000-0000-4000-8000-000000000001", reportNumber: "LYM-OUT-26001", accountId: seedCorporateAccounts[0].id,
    opportunityId: seedCorporateOpportunities[0].id, deploymentId: seedWorkforceDeployments[0].id, cohortId: null, expansionOpportunityId: null,
    title: "Operations workforce pilot - first outcome review", engagementType: "workforce", status: "review", periodStart: "2026-07-14", periodEnd: "2026-07-18",
    executiveSummary: "The first review cycle established a controlled weekly operating brief with traceable sources and executive approval.",
    baselineSummary: "The team spent approximately six hours each week assembling updates with inconsistent source references.",
    outcomesSummary: "The first approved brief reduced preparation effort, improved traceability and recorded zero material data incidents.",
    recommendations: "Complete three monthly review cycles, standardise KPI intake and evaluate a second workflow before expansion.",
    clientApproved: false, approvedBy: null, approvedAt: null, publishedAt: null, createdBy: "user-admin",
    createdAt: "2026-07-18T15:00:00.000Z", updatedAt: "2026-07-18T15:00:00.000Z",
  },
];

const seedOutcomeMetrics: OutcomeMetric[] = [
  { id: "d2000000-0000-4000-8000-000000000001", outcomeReportId: seedOutcomeReports[0].id, name: "Weekly preparation time", unit: "hours", baselineValue: 6, currentValue: 3.25, targetValue: 2.5, direction: "decrease", evidenceSource: "Approved time log and operating-review checklist", verified: true, sortOrder: 10, createdAt: "2026-07-18T15:00:00.000Z", updatedAt: "2026-07-18T15:00:00.000Z" },
  { id: "d2000000-0000-4000-8000-000000000002", outcomeReportId: seedOutcomeReports[0].id, name: "Quality index", unit: "score", baselineValue: 80, currentValue: 92.75, targetValue: 90, direction: "increase", evidenceSource: "Lymora operator QA review", verified: true, sortOrder: 20, createdAt: "2026-07-18T15:00:00.000Z", updatedAt: "2026-07-18T15:00:00.000Z" },
  { id: "d2000000-0000-4000-8000-000000000003", outcomeReportId: seedOutcomeReports[0].id, name: "Material risk incidents", unit: "incidents", baselineValue: 0, currentValue: 0, targetValue: 0, direction: "maintain", evidenceSource: "Risk and exception register", verified: true, sortOrder: 30, createdAt: "2026-07-18T15:00:00.000Z", updatedAt: "2026-07-18T15:00:00.000Z" },
];

const seedCaseStudies: CaseStudy[] = [
  { id: "d3000000-0000-4000-8000-000000000001", outcomeReportId: seedOutcomeReports[0].id, slug: "controlled-operating-reviews", title: "Building a controlled weekly operating review", clientDisplayName: "Confidential UAE advisory firm", industry: "Professional Services", summary: "A first-cycle working draft based on verified pilot evidence.", challenge: "Leadership reporting required manual synthesis and source reconciliation each week.", intervention: "Lymora deployed an AI Operations Operator with an approved SOP, fixed source folders and executive review checkpoints.", result: "Preparation time reduced in the first cycle while quality remained above target and no material incidents were recorded.", evidenceNote: "Early pilot evidence. Publish only after three cycles and written client consent.", status: "draft", featured: false, publicationConsent: false, publishedAt: null, createdBy: "user-admin", createdAt: "2026-07-18T15:30:00.000Z", updatedAt: "2026-07-18T15:30:00.000Z" },
];

const seedTestimonials: Testimonial[] = [
  { id: "d4000000-0000-4000-8000-000000000001", accountId: seedCorporateAccounts[0].id, caseStudyId: seedCaseStudies[0].id, quote: "The first operating brief was clear, traceable and materially faster to review.", attributionName: "Samira Noor", attributionTitle: "Chief Operating Officer", attributionCompany: "Confidential UAE advisory firm", permission: "pending", source: "Recorded client QA feedback", status: "draft", collectedAt: "2026-07-18", publishedAt: null, createdBy: "user-admin", createdAt: "2026-07-18T15:30:00.000Z", updatedAt: "2026-07-18T15:30:00.000Z" },
];

const seedRoleSpecialisations: RoleSpecialisation[] = [
  { id: "d5000000-0000-4000-8000-000000000001", slug: "ai-operations-operator", name: "AI Operations Operator", operatorType: "operations", targetDepartment: "Operations", promise: "Turn recurring management work into controlled, measurable operating rhythms.", responsibilities: ["Prepare verified operating briefs", "Maintain workflow SOPs", "Track actions and exceptions"], approvedTools: ["Approved AI workspace", "Google Workspace", "Client CRM"], successMetrics: ["Hours saved", "Quality index", "On-time reporting", "Risk incidents"], readinessRequirements: "Documented source ownership, named human approver and stable recurring workflows.", targetHoursSavedMonth: 24, status: "pilot", ownerId: "user-admin", createdAt: "2026-07-18T16:00:00.000Z", updatedAt: "2026-07-18T16:00:00.000Z" },
  { id: "d5000000-0000-4000-8000-000000000002", slug: "ai-sales-intelligence-operator", name: "AI Sales Intelligence Operator", operatorType: "sales", targetDepartment: "Sales", promise: "Create evidence-led account intelligence and disciplined CRM follow-through.", responsibilities: ["Research priority accounts", "Prepare source-backed sales briefs", "Maintain CRM research workflows"], approvedTools: ["Approved AI workspace", "CRM", "Verified research sources"], successMetrics: ["Research turnaround", "Brief acceptance", "Qualified pipeline influenced"], readinessRequirements: "Defined ideal customer profile, CRM ownership and approved research-source policy.", targetHoursSavedMonth: 30, status: "draft", ownerId: "user-admin", createdAt: "2026-07-18T16:00:00.000Z", updatedAt: "2026-07-18T16:00:00.000Z" },
  { id: "d5000000-0000-4000-8000-000000000003", slug: "ai-executive-assistant", name: "AI Executive Assistant", operatorType: "executive_assistant", targetDepartment: "Executive Office", promise: "Give leadership a reliable briefing, coordination and decision-support layer.", responsibilities: ["Prepare executive briefs", "Structure meeting follow-through", "Maintain decision records"], approvedTools: ["Approved AI workspace", "Calendar", "Document workspace"], successMetrics: ["Preparation time", "Action closure", "Executive satisfaction"], readinessRequirements: "Clear confidentiality boundaries, escalation rules and executive approval ownership.", targetHoursSavedMonth: 20, status: "draft", ownerId: "user-admin", createdAt: "2026-07-18T16:00:00.000Z", updatedAt: "2026-07-18T16:00:00.000Z" },
];

const seedPartnerships: Partnership[] = [
  { id: "d6000000-0000-4000-8000-000000000001", organizationName: "UAE Business Leadership Network", type: "business_community", status: "conversation", contactName: "Community Director", contactEmail: "partnerships@example.com", contactPhone: "", website: "https://example.com", valueProposition: "Executive AI readiness briefings and member workforce diagnostics.", nextStep: "Agree a private executive briefing date", nextStepDueAt: "2026-08-05", ownerId: "user-admin", createdAt: "2026-07-18T16:30:00.000Z", updatedAt: "2026-07-18T16:30:00.000Z" },
  { id: "d6000000-0000-4000-8000-000000000002", organizationName: "Gulf Talent Partners", type: "recruiter", status: "prospect", contactName: "Partnership Lead", contactEmail: "talent@example.com", contactPhone: "", website: "https://example.com", valueProposition: "A qualified pathway from professional talent into assessed AI operator roles.", nextStep: "Share operator screening standard", nextStepDueAt: "2026-08-10", ownerId: "user-admin", createdAt: "2026-07-18T16:30:00.000Z", updatedAt: "2026-07-18T16:30:00.000Z" },
];

const seedPartnerReferrals: PartnerReferral[] = [
  { id: "d7000000-0000-4000-8000-000000000001", partnershipId: seedPartnerships[0].id, accountId: seedCorporateAccounts[1].id, opportunityId: seedCorporateOpportunities[1].id, contactName: "Omar Rahal", companyName: "Meridian Clinics Group", status: "qualified", estimatedValueAed: 18000, notes: "Introduced after an executive community discussion.", referredAt: "2026-07-15", convertedAt: null, createdBy: "user-admin", createdAt: "2026-07-15T09:00:00.000Z", updatedAt: "2026-07-17T09:00:00.000Z" },
];

const seedRepeatabilityBenchmarks: RepeatabilityBenchmark[] = [
  { id: "d8000000-0000-4000-8000-000000000001", specialisationId: seedRoleSpecialisations[0].id, engagementType: "workforce", industry: "Professional Services", metricName: "Weekly preparation time", unit: "hours", sampleSize: 1, medianBaseline: 6, medianResult: 3.25, improvementPercent: 45.8, evidenceThreshold: 3, status: "emerging", reviewedBy: "user-admin", reviewedAt: "2026-07-18T17:00:00.000Z", createdAt: "2026-07-18T17:00:00.000Z", updatedAt: "2026-07-18T17:00:00.000Z" },
];

async function seedUsers(): Promise<User[]> {
  const now = "2026-07-10T08:00:00.000Z";
  const developmentPassword = (value: string | undefined, fallback: string, variable: string) => {
    if (process.env.NODE_ENV === "production" && !value) throw new Error(`${variable} is required in production`);
    return value || fallback;
  };
  const adminPassword = developmentPassword(process.env.LYMORA_ADMIN_PASSWORD, "LymoraAdmin!2026", "LYMORA_ADMIN_PASSWORD");
  const academyPassword = developmentPassword(process.env.LYMORA_ACADEMY_PASSWORD, "AcademyOps!2026", "LYMORA_ACADEMY_PASSWORD");
  const assessorPassword = developmentPassword(process.env.LYMORA_ASSESSOR_PASSWORD, "Assessor!2026", "LYMORA_ASSESSOR_PASSWORD");
  const candidatePassword = developmentPassword(process.env.LYMORA_CANDIDATE_PASSWORD, "Candidate!2026", "LYMORA_CANDIDATE_PASSWORD");

  return [
    { id: "user-admin", name: "Muhammad", email: process.env.LYMORA_ADMIN_EMAIL || "admin@lymoraops.com", passwordHash: await hash(adminPassword, 12), role: "super_admin", status: "active", lastLoginAt: null, createdAt: now },
    { id: "user-academy", name: "Nadia Kareem", email: "academy@lymoraops.com", passwordHash: await hash(academyPassword, 12), role: "academy_ops", status: "active", lastLoginAt: null, createdAt: now },
    { id: "user-assessor", name: "Dr. Elias Ward", email: "assessor@lymoraops.com", passwordHash: await hash(assessorPassword, 12), role: "assessor", status: "active", lastLoginAt: null, createdAt: now },
    { id: "user-candidate", name: "Leila Haddad", email: "candidate@lymoraops.com", passwordHash: await hash(candidatePassword, 12), role: "candidate", status: "active", applicationId: "app-leila", lastLoginAt: null, createdAt: now },
  ];
}

let databasePromise: Promise<Low<DatabaseSchema>> | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

async function initialiseDatabase() {
  await mkdir(dataDirectory, { recursive: true });
  const database = new Low<DatabaseSchema>(new JSONFile<DatabaseSchema>(dataFile), structuredClone(emptyDatabase));
  await database.read();
  database.data = { ...structuredClone(emptyDatabase), ...database.data };

  if (database.data.users.length === 0) database.data.users = await seedUsers();
  if (database.data.applications.length === 0) database.data.applications = seedApplications;
  if (database.data.cohorts.length === 0) database.data.cohorts = seedCohorts;
  if (database.data.enrollments.length === 0) database.data.enrollments = seedEnrollments;
  if (database.data.corporateAccounts.length === 0) database.data.corporateAccounts = seedCorporateAccounts;
  if (database.data.corporateOpportunities.length === 0) database.data.corporateOpportunities = seedCorporateOpportunities;
  if (database.data.readinessAssessments.length === 0) database.data.readinessAssessments = seedReadinessAssessments;
  if (database.data.workflowOpportunities.length === 0) database.data.workflowOpportunities = seedWorkflowOpportunities;
  if (database.data.corporateProposals.length === 0) database.data.corporateProposals = seedCorporateProposals;
  if (database.data.corporateWorkshops.length === 0) database.data.corporateWorkshops = seedCorporateWorkshops;
  if (database.data.workforceOperators.length === 0) database.data.workforceOperators = seedWorkforceOperators;
  if (database.data.operatorOnboardingItems.length === 0) database.data.operatorOnboardingItems = seedOperatorOnboardingItems;
  if (database.data.workforceMatches.length === 0) database.data.workforceMatches = seedWorkforceMatches;
  if (database.data.workforceDeployments.length === 0) database.data.workforceDeployments = seedWorkforceDeployments;
  if (database.data.clientSops.length === 0) database.data.clientSops = seedClientSops;
  if (database.data.operatorQualityReviews.length === 0) database.data.operatorQualityReviews = seedOperatorQualityReviews;
  if (database.data.outcomeReports.length === 0) database.data.outcomeReports = seedOutcomeReports;
  if (database.data.outcomeMetrics.length === 0) database.data.outcomeMetrics = seedOutcomeMetrics;
  if (database.data.caseStudies.length === 0) database.data.caseStudies = seedCaseStudies;
  if (database.data.testimonials.length === 0) database.data.testimonials = seedTestimonials;
  if (database.data.roleSpecialisations.length === 0) database.data.roleSpecialisations = seedRoleSpecialisations;
  if (database.data.partnerships.length === 0) database.data.partnerships = seedPartnerships;
  if (database.data.partnerReferrals.length === 0) database.data.partnerReferrals = seedPartnerReferrals;
  if (database.data.repeatabilityBenchmarks.length === 0) database.data.repeatabilityBenchmarks = seedRepeatabilityBenchmarks;
  if (database.data.activities.length === 0) {
    database.data.activities = [
      { id: randomUUID(), actorId: "user-admin", action: "cohort.created", entityType: "cohort", entityId: "cohort-caio-01", detail: "Created CAIO Founding Cohort", createdAt: "2026-07-10T09:00:00.000Z" },
      { id: randomUUID(), actorId: "user-admin", action: "application.accepted", entityType: "application", entityId: "app-maya", detail: "Accepted Maya Chen", createdAt: "2026-07-17T16:20:00.000Z" },
      { id: randomUUID(), actorId: "user-academy", action: "application.reviewed", entityType: "application", entityId: "app-omar", detail: "Moved Omar Al Mansoori to screening", createdAt: "2026-07-19T07:05:00.000Z" },
    ];
  }

  database.data.sessions = database.data.sessions.filter((session) => new Date(session.expiresAt) > new Date());
  await database.write();
  return database;
}

export async function readDatabase(): Promise<DatabaseSchema> {
  assertSupabaseConfiguration();
  if (wantsSupabase()) return readSupabaseDatabase();
  databasePromise ??= initialiseDatabase();
  const database = await databasePromise;
  await database.read();
  return structuredClone(database.data);
}

export async function updateDatabase<T>(operation: (data: DatabaseSchema) => T | Promise<T>): Promise<T> {
  assertSupabaseConfiguration();
  if (wantsSupabase()) return updateSupabaseDatabase(operation);
  let result!: T;
  const queued = writeQueue.then(async () => {
    databasePromise ??= initialiseDatabase();
    const database = await databasePromise;
    await database.read();
    result = await operation(database.data);
    await database.write();
  });
  writeQueue = queued.catch(() => undefined);
  await queued;
  return result;
}
