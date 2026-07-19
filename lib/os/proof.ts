import type { MetricDirection, OutcomeMetric, ProofEngagementType, ProofContentStatus } from "@/lib/os/types";

export const proofEngagementLabels: Record<ProofEngagementType, string> = {
  academy: "Academy cohort",
  team_enablement: "Team AI enablement",
  workforce: "Managed AI workforce",
  workflow_implementation: "Workflow implementation",
};

export const proofStatusLabels: Record<ProofContentStatus, string> = {
  draft: "Draft",
  review: "In review",
  approved: "Approved",
  published: "Published",
};

export function metricImprovement(metric: Pick<OutcomeMetric, "baselineValue" | "currentValue" | "direction">) {
  if (metric.baselineValue === 0) return 0;
  const raw = (metric.currentValue - metric.baselineValue) / Math.abs(metric.baselineValue) * 100;
  return Math.round((metric.direction === "decrease" ? -raw : raw) * 10) / 10;
}

export function metricProgress(metric: Pick<OutcomeMetric, "baselineValue" | "currentValue" | "targetValue" | "direction">) {
  if (metric.targetValue === null || metric.targetValue === metric.baselineValue) return null;
  const actual = metric.direction === "decrease"
    ? metric.baselineValue - metric.currentValue
    : metric.currentValue - metric.baselineValue;
  const target = metric.direction === "decrease"
    ? metric.baselineValue - metric.targetValue
    : metric.targetValue - metric.baselineValue;
  return target === 0 ? null : Math.max(0, Math.min(100, Math.round(actual / target * 100)));
}

export function directionLabel(direction: MetricDirection) {
  return direction === "maintain" ? "Maintain" : direction === "increase" ? "Increase" : "Decrease";
}
