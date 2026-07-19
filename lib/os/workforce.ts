import type { OperatorQualityReview, WorkforceDeployment, WorkforceOperatorType } from "@/lib/os/types";

export const operatorTypes: Record<WorkforceOperatorType, { label: string; shortLabel: string }> = {
  executive_assistant: { label: "AI Executive Assistant", shortLabel: "Executive support" },
  marketing: { label: "AI Marketing Operator", shortLabel: "Marketing" },
  sales: { label: "AI Sales Operator", shortLabel: "Sales" },
  operations: { label: "AI Operations Operator", shortLabel: "Operations" },
  customer_experience: { label: "AI Customer Experience Operator", shortLabel: "Customer experience" },
  recruitment: { label: "AI Recruitment Operator", shortLabel: "Recruitment" },
};

export const workforcePlans = {
  starter: { label: "Starter", capacity: "1 AI Operator" },
  growth: { label: "Growth", capacity: "3 AI Operators" },
  scale: { label: "Scale", capacity: "5+ AI Operators" },
  custom: { label: "Custom", capacity: "Tailored deployment" },
} as const;

export const onboardingChecklist = [
  { key: "identity", label: "Identity and right-to-work verification", category: "Compliance" },
  { key: "background", label: "Background and reference screening", category: "Compliance" },
  { key: "credential", label: "Capability evidence and credential review", category: "Capability" },
  { key: "nda", label: "Confidentiality agreement", category: "Compliance" },
  { key: "data_policy", label: "Client data and responsible-AI policy", category: "Governance" },
  { key: "tools", label: "Approved tool access and security setup", category: "Systems" },
  { key: "role_playbook", label: "Client role playbook and workflow rehearsal", category: "Delivery" },
] as const;

export function deploymentEconomics(deployment: Pick<WorkforceDeployment, "clientRateMonthlyAed" | "operatorCostMonthlyAed" | "managementAllocationAed" | "toolsOverheadAed">) {
  const deliveryCost = deployment.operatorCostMonthlyAed + deployment.managementAllocationAed + deployment.toolsOverheadAed;
  const grossProfit = deployment.clientRateMonthlyAed - deliveryCost;
  const grossMargin = deployment.clientRateMonthlyAed ? Math.round(grossProfit / deployment.clientRateMonthlyAed * 100) : 0;
  return { deliveryCost, grossProfit, grossMargin };
}

export function averageQuality(review: Pick<OperatorQualityReview, "qualityScore" | "reliabilityScore" | "responsibleAiScore" | "clientSatisfactionScore">) {
  return Math.round((review.qualityScore + review.reliabilityScore + review.responsibleAiScore + review.clientSatisfactionScore) / 4);
}

export function statusLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
