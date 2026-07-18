import { redirect } from "next/navigation";
import { Check, Circle, LockKeyhole } from "lucide-react";
import { requireUser } from "@/lib/os/auth";

const modules = [
  { week: "01", title: "AI operations foundations", detail: "Operating models, limits and accountable human review", state: "ready" },
  { week: "02", title: "Prompt and context systems", detail: "Reliable instructions, context design and output standards", state: "locked" },
  { week: "03", title: "Workflow design", detail: "Mapping, prototyping and controlled implementation", state: "locked" },
  { week: "04", title: "Quality and responsible AI", detail: "Verification, risk classification and governance", state: "locked" },
  { week: "05", title: "Capstone deployment", detail: "Build and defend a production-ready operating workflow", state: "locked" },
];

export default async function LearningPage() {
  const user = await requireUser();
  if (user.role !== "candidate") redirect("/app");
  return (
    <div className="os-page">
      <div className="os-page-head"><div><span className="os-label">CAIO learning pathway</span><h1>From capability to evidence.</h1><p>Five applied weeks leading to a verified professional credential.</p></div></div>
      <section className="os-learning-list">{modules.map((module, index) => <div key={module.week} className={module.state === "ready" ? "is-ready" : ""}><span className="os-module-number">{module.week}</span><div><span>Week {index + 1}</span><h2>{module.title}</h2><p>{module.detail}</p></div><div className="os-module-state">{module.state === "ready" ? <><Circle size={18} /> Opens 17 Aug</> : <><LockKeyhole size={17} /> Locked</>}</div></div>)}</section>
      <div className="os-learning-standard"><Check size={17} /><p><strong>Certification standard:</strong> Complete 36 applied hours and achieve a minimum weighted score of 75%.</p></div>
    </div>
  );
}
