"use client";

import { useMemo, useState } from "react";
import { Check, Save } from "lucide-react";
import { saveReadinessAssessmentAction } from "@/lib/os/actions";
import { calculateReadiness, readinessDimensions } from "@/lib/os/corporate";
import type { ReadinessAssessment } from "@/lib/os/types";

type ScoreKey = (typeof readinessDimensions)[number]["key"];

export function ReadinessForm({ assessment }: { assessment: ReadinessAssessment }) {
  const [scores, setScores] = useState<Record<ScoreKey, number>>(() => Object.fromEntries(readinessDimensions.map((dimension) => [dimension.key, Number(assessment[dimension.key])])) as Record<ScoreKey, number>);
  const result = useMemo(() => calculateReadiness(Object.values(scores)), [scores]);
  return (
    <form action={saveReadinessAssessmentAction} className="os-panel os-readiness-form">
      <input type="hidden" name="opportunityId" value={assessment.opportunityId} />
      <input type="hidden" name="assessmentId" value={assessment.id} />
      <div className="os-panel-head"><div><span className="os-label">Readiness baseline</span><h2>Seven dimensions</h2></div><div className={`os-readiness-live is-${result.maturity}`}><strong>{result.overall}</strong><span>{result.maturity}</span></div></div>
      <div className="os-readiness-dimensions">
        {readinessDimensions.map((dimension) => (
          <label key={dimension.key}>
            <span><strong>{dimension.label}</strong><small>{dimension.description}</small></span>
            <input type="range" name={dimension.key} min="0" max="100" step="1" value={scores[dimension.key]} onChange={(event) => setScores((current) => ({ ...current, [dimension.key]: Number(event.target.value) }))} />
            <output>{scores[dimension.key]}</output>
          </label>
        ))}
      </div>
      <div className="os-form-grid os-readiness-notes">
        <label>Respondent<input name="respondentName" defaultValue={assessment.respondentName} placeholder="Executive sponsor or workshop lead" /></label>
        <label>Status<select name="status" defaultValue={assessment.status}><option value="draft">Working draft</option><option value="completed">Complete diagnostic</option></select></label>
        <label className="full">Executive summary<textarea name="executiveSummary" defaultValue={assessment.executiveSummary} rows={4} placeholder="State the readiness signal, constraints and implementation path." /></label>
        <label>Priority actions<textarea name="priorities" defaultValue={assessment.priorities} rows={4} /></label>
        <label>Material risks<textarea name="risks" defaultValue={assessment.risks} rows={4} /></label>
      </div>
      <div className="os-form-actions"><span className="os-form-assurance"><Check size={14} /> Score and maturity are calculated automatically</span><button className="os-button" type="submit"><Save size={15} /> Save diagnostic</button></div>
    </form>
  );
}
