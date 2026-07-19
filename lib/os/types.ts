export const roles = ["super_admin", "academy_ops", "talent_ops", "assessor", "candidate", "operator"] as const;
export type Role = (typeof roles)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: "active" | "invited" | "disabled";
  applicationId?: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export type SafeUser = Omit<User, "passwordHash">;

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
};

export const applicationStatuses = [
  "new",
  "screening",
  "interview",
  "accepted",
  "waitlisted",
  "declined",
] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export type Application = {
  id: string;
  number: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  industry: string;
  experience: string;
  aiLevel: string;
  track: string;
  workflowGoal: string;
  motivation: string;
  scheduleCommitment: string;
  investmentReadiness: string;
  linkedinUrl: string;
  status: ApplicationStatus;
  score: number | null;
  notes: string;
  source: "website" | "manual" | "referral";
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CohortStatus = "draft" | "enrolling" | "active" | "completed";

export type Cohort = {
  id: string;
  code: string;
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  schedule: string;
  capacity: number;
  status: CohortStatus;
  createdAt: string;
};

export type Enrollment = {
  id: string;
  cohortId: string;
  applicationId: string;
  status: "invited" | "enrolled" | "active" | "completed" | "withdrawn";
  progress: number;
  createdAt: string;
};

export type LearningModule = {
  id: string;
  programCode: string;
  code: string;
  weekNumber: number;
  title: string;
  summary: string;
  competencyDomain: string;
  liveHours: number;
  status: "draft" | "published" | "archived";
  sortOrder: number;
  createdAt: string;
};

export type CohortModule = {
  id: string;
  cohortId: string;
  moduleId: string;
  opensAt: string;
  dueAt: string;
  status: "locked" | "open" | "completed";
};

export type CohortSession = {
  id: string;
  cohortId: string;
  moduleId: string | null;
  title: string;
  startsAt: string;
  endsAt: string;
  deliveryMode: "live_online" | "in_person" | "hybrid";
  joinUrl: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  createdBy: string | null;
  createdAt: string;
};

export type AttendanceRecord = {
  id: string;
  sessionId: string;
  enrollmentId: string;
  status: "present" | "late" | "excused" | "absent";
  minutesAttended: number;
  notes: string;
  markedBy: string | null;
  markedAt: string;
};

export type AssessmentComponent = {
  id: string;
  programCode: string;
  code: string;
  title: string;
  description: string;
  weight: number;
  passThreshold: number;
  responsibleAiGate: boolean;
  sortOrder: number;
  createdAt: string;
};

export type AssessmentSubmission = {
  id: string;
  enrollmentId: string;
  componentId: string;
  status: "not_started" | "submitted" | "under_review" | "revision_requested" | "accepted";
  evidenceUrl: string;
  submissionNotes: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentResult = {
  id: string;
  submissionId: string;
  score: number;
  outcome: "pass" | "resubmit" | "fail";
  feedback: string;
  gradedBy: string | null;
  gradedAt: string;
};

export type Credential = {
  id: string;
  enrollmentId: string;
  credentialNumber: string;
  status: "eligible" | "issued" | "revoked" | "expired";
  overallScore: number;
  classification: "pass" | "distinction";
  issuedAt: string | null;
  expiresAt: string | null;
  verificationCode: string;
  issuedBy: string | null;
  createdAt: string;
};

export type CorporateAccountStatus = "prospect" | "active" | "client" | "inactive";
export type OpportunityStage = "lead" | "qualified" | "diagnosis" | "proposal" | "proof" | "won" | "lost";
export type CorporatePackage = "team_enablement_15" | "team_enablement_30" | "private_caio" | "enterprise";
export type AiMaturityLevel = "emerging" | "developing" | "ready" | "leading";
export type AiRiskLevel = "green" | "amber" | "red";

export type CorporateAccount = {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  employeeBand: string;
  location: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactTitle: string;
  ownerId: string | null;
  source: string;
  status: CorporateAccountStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type CorporateOpportunity = {
  id: string;
  accountId: string;
  title: string;
  package: CorporatePackage;
  participantCount: number;
  stage: OpportunityStage;
  valueAed: number;
  probability: number;
  expectedCloseDate: string | null;
  nextStep: string;
  nextStepDueAt: string | null;
  ownerId: string | null;
  lostReason: string;
  createdAt: string;
  updatedAt: string;
};

export type ReadinessAssessment = {
  id: string;
  opportunityId: string;
  status: "draft" | "completed";
  respondentName: string;
  leadershipScore: number;
  peopleScore: number;
  processScore: number;
  dataScore: number;
  toolsScore: number;
  governanceScore: number;
  adoptionScore: number;
  overallScore: number;
  maturity: AiMaturityLevel;
  executiveSummary: string;
  priorities: string;
  risks: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowOpportunity = {
  id: string;
  readinessAssessmentId: string;
  workflowName: string;
  department: string;
  currentPain: string;
  frequency: string;
  valueScore: number;
  feasibilityScore: number;
  riskLevel: AiRiskLevel;
  humanOversight: string;
  recommendation: string;
  priority: number;
  createdAt: string;
};

export type CorporateProposal = {
  id: string;
  opportunityId: string;
  proposalNumber: string;
  package: CorporatePackage;
  participantCount: number;
  subtotalAed: number;
  vatRate: number;
  vatAed: number;
  totalAed: number;
  scope: string;
  timeline: string;
  assumptions: string;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  validUntil: string;
  sentAt: string | null;
  acceptedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CorporateWorkshop = {
  id: string;
  opportunityId: string;
  proposalId: string | null;
  title: string;
  workshopType: "executive_readiness" | "team_enablement" | "manager_coaching" | "workflow_lab";
  startsAt: string;
  endsAt: string;
  deliveryMode: "live_online" | "in_person" | "hybrid";
  location: string;
  joinUrl: string;
  status: "planned" | "confirmed" | "completed" | "cancelled";
  facilitator: string;
  participantTarget: number;
  outcomes: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkforceOperatorType = "executive_assistant" | "marketing" | "sales" | "operations" | "customer_experience" | "recruitment";
export type WorkforceOperatorStatus = "applicant" | "screening" | "onboarding" | "available" | "matched" | "deployed" | "paused" | "inactive";
export type WorkforceWorkMode = "remote" | "on_site" | "hybrid";
export type OnboardingTaskStatus = "pending" | "in_progress" | "complete" | "waived";
export type WorkforceMatchStatus = "suggested" | "shortlisted" | "client_review" | "approved" | "rejected" | "withdrawn";
export type WorkforcePlan = "starter" | "growth" | "scale" | "custom";
export type WorkforceDeploymentStatus = "preparing" | "active" | "paused" | "completed" | "terminated";
export type ClientSopStatus = "draft" | "review" | "approved" | "retired";
export type QualityReviewOutcome = "on_track" | "coaching" | "at_risk";

export type WorkforceOperator = {
  id: string;
  profileId: string | null;
  applicationId: string | null;
  credentialId: string | null;
  operatorNumber: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  operatorType: WorkforceOperatorType;
  status: WorkforceOperatorStatus;
  workMode: WorkforceWorkMode;
  specialisation: string;
  skills: string[];
  experienceSummary: string;
  readinessScore: number;
  monthlyCostAed: number;
  capacityHoursMonth: number;
  availableFrom: string | null;
  backgroundCheckComplete: boolean;
  ndaSignedAt: string | null;
  dataPolicySignedAt: string | null;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OperatorOnboardingItem = {
  id: string;
  operatorId: string;
  taskKey: string;
  label: string;
  category: string;
  status: OnboardingTaskStatus;
  dueDate: string | null;
  completedAt: string | null;
  completedBy: string | null;
  notes: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type WorkforceMatch = {
  id: string;
  operatorId: string;
  accountId: string;
  opportunityId: string | null;
  roleTitle: string;
  status: WorkforceMatchStatus;
  matchScore: number;
  proposedRateAed: number;
  rationale: string;
  clientRequirements: string;
  submittedAt: string | null;
  decidedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkforceDeployment = {
  id: string;
  deploymentNumber: string;
  matchId: string | null;
  operatorId: string;
  accountId: string;
  opportunityId: string | null;
  plan: WorkforcePlan;
  roleTitle: string;
  status: WorkforceDeploymentStatus;
  startsOn: string;
  endsOn: string | null;
  minimumTermMonths: number;
  clientRateMonthlyAed: number;
  operatorCostMonthlyAed: number;
  managementAllocationAed: number;
  toolsOverheadAed: number;
  targetHoursMonth: number;
  accountManagerId: string | null;
  clientOwnerName: string;
  clientOwnerEmail: string;
  outcomes: string;
  successMeasures: string;
  nextReviewAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientSop = {
  id: string;
  deploymentId: string;
  title: string;
  department: string;
  version: number;
  status: ClientSopStatus;
  riskLevel: AiRiskLevel;
  purpose: string;
  approvedTools: string[];
  inputs: string;
  procedure: string;
  reviewCriteria: string;
  dataControls: string;
  humanApprover: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OperatorQualityReview = {
  id: string;
  deploymentId: string;
  operatorId: string;
  reviewDate: string;
  periodStart: string;
  periodEnd: string;
  reviewerId: string | null;
  qualityScore: number;
  reliabilityScore: number;
  responsibleAiScore: number;
  clientSatisfactionScore: number;
  utilisationPercent: number;
  hoursWorked: number;
  hoursSaved: number;
  riskIncidents: number;
  clientFeedback: string;
  strengths: string;
  actions: string;
  outcome: QualityReviewOutcome;
  createdAt: string;
};

export type ProofContentStatus = "draft" | "review" | "approved" | "published";
export type ProofEngagementType = "academy" | "team_enablement" | "workforce" | "workflow_implementation";
export type MetricDirection = "increase" | "decrease" | "maintain";
export type TestimonialPermission = "pending" | "approved" | "declined";
export type RoleSpecialisationStatus = "draft" | "pilot" | "proven" | "retired";
export type PartnershipType = "business_community" | "training_provider" | "professional_association" | "recruiter" | "technology_provider" | "referral_partner";
export type PartnershipStatus = "prospect" | "conversation" | "active" | "paused" | "closed";
export type PartnerReferralStatus = "referred" | "qualified" | "converted" | "lost";
export type BenchmarkStatus = "emerging" | "validated" | "reference";

export type OutcomeReport = {
  id: string;
  reportNumber: string;
  accountId: string | null;
  opportunityId: string | null;
  deploymentId: string | null;
  cohortId: string | null;
  expansionOpportunityId: string | null;
  title: string;
  engagementType: ProofEngagementType;
  status: ProofContentStatus;
  periodStart: string;
  periodEnd: string;
  executiveSummary: string;
  baselineSummary: string;
  outcomesSummary: string;
  recommendations: string;
  clientApproved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OutcomeMetric = {
  id: string;
  outcomeReportId: string;
  name: string;
  unit: string;
  baselineValue: number;
  currentValue: number;
  targetValue: number | null;
  direction: MetricDirection;
  evidenceSource: string;
  verified: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CaseStudy = {
  id: string;
  outcomeReportId: string;
  slug: string;
  title: string;
  clientDisplayName: string;
  industry: string;
  summary: string;
  challenge: string;
  intervention: string;
  result: string;
  evidenceNote: string;
  status: ProofContentStatus;
  featured: boolean;
  publicationConsent: boolean;
  publishedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  accountId: string | null;
  caseStudyId: string | null;
  quote: string;
  attributionName: string;
  attributionTitle: string;
  attributionCompany: string;
  permission: TestimonialPermission;
  source: string;
  status: ProofContentStatus;
  collectedAt: string;
  publishedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RoleSpecialisation = {
  id: string;
  slug: string;
  name: string;
  operatorType: WorkforceOperatorType;
  targetDepartment: string;
  promise: string;
  responsibilities: string[];
  approvedTools: string[];
  successMetrics: string[];
  readinessRequirements: string;
  targetHoursSavedMonth: number;
  status: RoleSpecialisationStatus;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Partnership = {
  id: string;
  organizationName: string;
  type: PartnershipType;
  status: PartnershipStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  valueProposition: string;
  nextStep: string;
  nextStepDueAt: string | null;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerReferral = {
  id: string;
  partnershipId: string;
  accountId: string | null;
  opportunityId: string | null;
  contactName: string;
  companyName: string;
  status: PartnerReferralStatus;
  estimatedValueAed: number;
  notes: string;
  referredAt: string;
  convertedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RepeatabilityBenchmark = {
  id: string;
  specialisationId: string | null;
  engagementType: ProofEngagementType;
  industry: string;
  metricName: string;
  unit: string;
  sampleSize: number;
  medianBaseline: number;
  medianResult: number;
  improvementPercent: number;
  evidenceThreshold: number;
  status: BenchmarkStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: "application" | "cohort" | "enrollment" | "session" | "user" | "assessment" | "credential" | "account" | "opportunity" | "diagnostic" | "proposal" | "workshop" | "operator" | "match" | "deployment" | "sop" | "quality_review" | "outcome_report" | "case_study" | "testimonial" | "specialisation" | "partnership" | "referral" | "benchmark";
  entityId: string;
  detail: string;
  createdAt: string;
};

export type DatabaseSchema = {
  users: User[];
  sessions: Session[];
  applications: Application[];
  cohorts: Cohort[];
  enrollments: Enrollment[];
  learningModules: LearningModule[];
  cohortModules: CohortModule[];
  cohortSessions: CohortSession[];
  attendanceRecords: AttendanceRecord[];
  assessmentComponents: AssessmentComponent[];
  assessmentSubmissions: AssessmentSubmission[];
  assessmentResults: AssessmentResult[];
  credentials: Credential[];
  corporateAccounts: CorporateAccount[];
  corporateOpportunities: CorporateOpportunity[];
  readinessAssessments: ReadinessAssessment[];
  workflowOpportunities: WorkflowOpportunity[];
  corporateProposals: CorporateProposal[];
  corporateWorkshops: CorporateWorkshop[];
  workforceOperators: WorkforceOperator[];
  operatorOnboardingItems: OperatorOnboardingItem[];
  workforceMatches: WorkforceMatch[];
  workforceDeployments: WorkforceDeployment[];
  clientSops: ClientSop[];
  operatorQualityReviews: OperatorQualityReview[];
  outcomeReports: OutcomeReport[];
  outcomeMetrics: OutcomeMetric[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  roleSpecialisations: RoleSpecialisation[];
  partnerships: Partnership[];
  partnerReferrals: PartnerReferral[];
  repeatabilityBenchmarks: RepeatabilityBenchmark[];
  activities: Activity[];
};

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  academy_ops: "Academy Operations",
  talent_ops: "Talent & Deployment",
  assessor: "Assessor",
  candidate: "Candidate",
  operator: "AI Operator",
};
