import type { ApplicationStatus, CohortStatus } from "@/lib/os/types";

const labels: Record<ApplicationStatus | CohortStatus | "active" | "invited" | "enrolled", string> = {
  new: "New",
  screening: "Screening",
  interview: "Interview",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  declined: "Declined",
  draft: "Draft",
  enrolling: "Enrolling",
  active: "Active",
  completed: "Completed",
  invited: "Invited",
  enrolled: "Enrolled",
};

export function StatusBadge({ status }: { status: keyof typeof labels }) {
  return <span className={`os-status os-status-${status}`}><i />{labels[status]}</span>;
}
