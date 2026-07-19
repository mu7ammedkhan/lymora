import type { AiMaturityLevel, CorporatePackage, OpportunityStage, ReadinessAssessment } from "@/lib/os/types";

export const corporatePackages: Record<CorporatePackage, { label: string; price: number; capacity: string }> = {
  team_enablement_15: { label: "Team Enablement 15", price: 12_500, capacity: "Up to 15 people" },
  team_enablement_30: { label: "Team Enablement 30", price: 22_500, capacity: "Up to 30 people" },
  private_caio: { label: "Private CAIO Cohort", price: 32_500, capacity: "Up to 12 people" },
  enterprise: { label: "Enterprise Enablement", price: 0, capacity: "Custom scope" },
};

export const opportunityStages: { id: OpportunityStage; label: string; probability: number }[] = [
  { id: "lead", label: "Lead", probability: 10 },
  { id: "qualified", label: "Qualified", probability: 25 },
  { id: "diagnosis", label: "Diagnosis", probability: 45 },
  { id: "proposal", label: "Proposal", probability: 65 },
  { id: "proof", label: "Proof", probability: 80 },
  { id: "won", label: "Won", probability: 100 },
  { id: "lost", label: "Lost", probability: 0 },
];

export const readinessDimensions = [
  { key: "leadershipScore", label: "Leadership", description: "Executive ownership and strategic direction" },
  { key: "peopleScore", label: "People", description: "Role capability and confidence" },
  { key: "processScore", label: "Process", description: "Workflow clarity and repeatability" },
  { key: "dataScore", label: "Data", description: "Access, quality and handling discipline" },
  { key: "toolsScore", label: "Tools", description: "Approved stack and integration readiness" },
  { key: "governanceScore", label: "Governance", description: "Policies, accountability and controls" },
  { key: "adoptionScore", label: "Adoption", description: "Usage habits and implementation momentum" },
] as const satisfies ReadonlyArray<{ key: keyof ReadinessAssessment; label: string; description: string }>;

export function getMaturity(score: number): AiMaturityLevel {
  if (score >= 80) return "leading";
  if (score >= 60) return "ready";
  if (score >= 40) return "developing";
  return "emerging";
}

export function calculateReadiness(scores: number[]) {
  const overall = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  return { overall, maturity: getMaturity(overall) };
}

export function calculateProposal(subtotal: number, vatRate = 5) {
  const vat = Math.round(subtotal * (vatRate / 100) * 100) / 100;
  return { subtotal, vat, total: subtotal + vat };
}

export function formatAed(value: number) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(value);
}

export const standardProposalScope = [
  "AI readiness assessment and department workflow audit",
  "Customised live training with role-specific instruction library",
  "Department AI playbook and responsible-AI guidance",
  "30-day implementation plan and manager coaching session",
  "Participant certificates and post-programme outcome report",
].join("\n");
