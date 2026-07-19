import type { DatabaseSchema } from "@/lib/os/types";

export function getAssessmentSummary(database: DatabaseSchema, enrollmentId: string) {
  const enrollment = database.enrollments.find((item) => item.id === enrollmentId);
  const cohort = database.cohorts.find((item) => item.id === enrollment?.cohortId);
  const programCode = cohort?.code.split("-")[0];
  const components = database.assessmentComponents
    .filter((item) => !programCode || item.programCode === programCode)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const items = components.map((component) => {
    const submission = database.assessmentSubmissions.find((item) => item.enrollmentId === enrollmentId && item.componentId === component.id);
    const result = database.assessmentResults.find((item) => item.submissionId === submission?.id);
    const meetsThreshold = Boolean(result && result.score >= component.passThreshold && result.outcome === "pass");
    return { component, submission, result, meetsThreshold };
  });
  const completedWeight = items.reduce((total, item) => total + (item.result ? item.component.weight : 0), 0);
  const overallScore = items.reduce((total, item) => total + ((item.result?.score ?? 0) * item.component.weight) / 100, 0);
  const responsibleAiPassed = items.filter((item) => item.component.responsibleAiGate).every((item) => item.meetsThreshold);
  const certificationReady = items.length > 0 && items.every((item) => item.meetsThreshold) && overallScore >= 75 && responsibleAiPassed;
  return {
    items,
    completedWeight,
    overallScore: Math.round(overallScore * 10) / 10,
    responsibleAiPassed,
    certificationReady,
    classification: overallScore >= 90 ? "distinction" as const : "pass" as const,
  };
}

export function getAttendanceRate(database: DatabaseSchema, enrollmentId: string, cohortId: string) {
  const sessionIds = new Set(database.cohortSessions.filter((session) => session.cohortId === cohortId && session.status !== "cancelled").map((session) => session.id));
  const records = database.attendanceRecords.filter((record) => record.enrollmentId === enrollmentId && sessionIds.has(record.sessionId));
  if (records.length === 0) return { rate: 0, attended: 0, recorded: 0 };
  const attended = records.filter((record) => record.status === "present" || record.status === "late").length;
  return { rate: Math.round((attended / records.length) * 100), attended, recorded: records.length };
}

export function effectiveModuleStatus(status: "locked" | "open" | "completed", opensAt: string) {
  if (status === "completed") return status;
  return new Date(opensAt) <= new Date() ? "open" : status;
}
