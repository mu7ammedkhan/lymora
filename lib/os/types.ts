export const roles = ["super_admin", "academy_ops", "assessor", "candidate"] as const;
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

export type Activity = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: "application" | "cohort" | "enrollment" | "session" | "user" | "assessment" | "credential";
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
  activities: Activity[];
};

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  academy_ops: "Academy Operations",
  assessor: "Assessor",
  candidate: "Candidate",
};
