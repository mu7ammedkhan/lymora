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

export type Activity = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: "application" | "cohort" | "enrollment" | "session" | "user";
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
  activities: Activity[];
};

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  academy_ops: "Academy Operations",
  assessor: "Assessor",
  candidate: "Candidate",
};
