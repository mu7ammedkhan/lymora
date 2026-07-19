import Link from "next/link";
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, Handshake, Plus, Quote, ScanSearch, Target } from "lucide-react";
import { ProofTabs } from "@/components/os/ProofTabs";
import { requireRole } from "@/lib/os/auth";
import { formatAed } from "@/lib/os/corporate";
import { proofEngagementLabels, proofStatusLabels } from "@/lib/os/proof";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function ProofDashboardPage() {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const accountById = new Map(database.corporateAccounts.map((item) => [item.id, item]));
  const metricsByReport = new Map(database.outcomeReports.map((report) => [report.id, database.outcomeMetrics.filter((metric) => metric.outcomeReportId === report.id)]));
  const verifiedReports = database.outcomeReports.filter((report) => {
    const metrics = metricsByReport.get(report.id) ?? [];
    return metrics.length > 0 && metrics.every((metric) => metric.verified);
  });
  const publishedProof = database.caseStudies.filter((item) => item.status === "published").length;
  const approvedTestimonials = database.testimonials.filter((item) => item.permission === "approved").length;
  const activePartners = database.partnerships.filter((item) => item.status === "active").length;
  const partnerPipeline = database.partnerReferrals.filter((item) => !["converted", "lost"].includes(item.status)).reduce((sum, item) => sum + item.estimatedValueAed, 0);
  const expansionIds = new Set(database.outcomeReports.map((item) => item.expansionOpportunityId).filter(Boolean));
  const expansionValue = database.corporateOpportunities.filter((item) => expansionIds.has(item.id)).reduce((sum, item) => sum + item.valueAed, 0);
  const benchmarksReady = database.repeatabilityBenchmarks.filter((item) => item.sampleSize >= item.evidenceThreshold).length;
  const reportStages = [
    { label: "Captured", value: database.outcomeReports.length },
    { label: "Evidence verified", value: verifiedReports.length },
    { label: "Client approved", value: database.outcomeReports.filter((item) => item.clientApproved).length },
    { label: "Published", value: database.outcomeReports.filter((item) => item.status === "published").length },
  ];
  const recentReports = database.outcomeReports.slice(0, 5);

  return (
    <div className="os-page os-proof-page">
      <div className="os-page-head"><div><span className="os-label">Evidence before scale</span><h1>Proof & Expansion</h1><p>Turn delivery evidence into approved outcomes, repeatable offers and the next commercial decision.</p></div><Link href="/app/proof/reports/new" className="os-button"><Plus size={16} /> New outcome report</Link></div>
      <ProofTabs active="overview" />

      <div className="os-proof-command">
        <div><span>Outcome reports</span><strong>{database.outcomeReports.length}</strong><small>{verifiedReports.length} fully verified</small></div>
        <div><span>Published proof</span><strong>{publishedProof}</strong><small>{approvedTestimonials} testimonials approved</small></div>
        <div><span>Expansion value</span><strong>{formatAed(expansionValue)}</strong><small>Evidence-led follow-on work</small></div>
        <div><span>Partner pipeline</span><strong>{formatAed(partnerPipeline)}</strong><small>{activePartners} active partners</small></div>
        <aside><Target size={20} /><span>Repeatability threshold<strong>{benchmarksReady} validated benchmark{benchmarksReady === 1 ? "" : "s"}</strong></span></aside>
      </div>

      <section className="os-proof-flow">
        <div className="os-section-heading"><div><span className="os-label">Trust progression</span><h2>Evidence pipeline</h2></div><span className="os-sample-note">Fictional workspace data</span></div>
        <div>{reportStages.map((stage, index) => <div key={stage.label} className={index === reportStages.length - 1 ? "is-published" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.value}</strong><small>{stage.label}</small></div>)}</div>
      </section>

      <div className="os-proof-grid">
        <section className="os-panel os-proof-report-list">
          <div className="os-panel-head"><div><span className="os-label">Outcome register</span><h2>Recent reports</h2></div><Link href="/app/proof/reports">View all <ArrowRight size={13} /></Link></div>
          <div>{recentReports.map((report) => { const account = report.accountId ? accountById.get(report.accountId) : null; const metrics = metricsByReport.get(report.id) ?? []; return <Link href={`/app/proof/reports/${report.id}`} key={report.id}><span className={`os-proof-state is-${report.status}`}>{proofStatusLabels[report.status]}</span><div><strong>{report.title}</strong><small>{account?.companyName ?? proofEngagementLabels[report.engagementType]} - {formatDate(report.periodEnd)}</small></div><span>{metrics.filter((item) => item.verified).length}/{metrics.length}<small>verified</small></span><ArrowRight size={14} /></Link>; })}{recentReports.length === 0 && <div className="os-quiet-empty">No outcome reports yet.</div>}</div>
        </section>

        <aside className="os-panel os-proof-readiness">
          <div className="os-panel-head"><div><span className="os-label">Publication control</span><h2>Proof readiness</h2></div><ScanSearch size={19} /></div>
          <div><BadgeCheck size={16} /><span>Verified reports<strong>{verifiedReports.length}</strong></span></div>
          <div><Quote size={16} /><span>Permission approved<strong>{approvedTestimonials}</strong></span></div>
          <div><ChartNoAxesCombined size={16} /><span>Reference benchmarks<strong>{benchmarksReady}</strong></span></div>
          <div><Handshake size={16} /><span>Partner referrals<strong>{database.partnerReferrals.length}</strong></span></div>
        </aside>
      </div>

      <div className="os-proof-lower">
        <section className="os-panel os-proof-benchmarks"><div className="os-panel-head"><div><span className="os-label">Repeatability evidence</span><h2>Benchmarks</h2></div><Link href="/app/proof/specialisations">Manage standards <ArrowRight size={13} /></Link></div>{database.repeatabilityBenchmarks.slice(0, 4).map((item) => <article key={item.id}><div><strong>{item.metricName}</strong><small>{item.industry} - {proofEngagementLabels[item.engagementType]}</small></div><span><strong>{item.improvementPercent}%</strong><small>measured change</small></span><span><strong>{item.sampleSize}/{item.evidenceThreshold}</strong><small>{item.status}</small></span></article>)}</section>
        <section className="os-panel os-proof-partners"><div className="os-panel-head"><div><span className="os-label">Expansion network</span><h2>Partner motion</h2></div><Link href="/app/proof/partnerships">Open pipeline <ArrowRight size={13} /></Link></div>{database.partnerships.slice(0, 4).map((partner) => <article key={partner.id}><span>{partner.organizationName.slice(0, 2).toUpperCase()}</span><div><strong>{partner.organizationName}</strong><small>{partner.type.replaceAll("_", " ")} - {partner.status}</small></div><strong>{database.partnerReferrals.filter((item) => item.partnershipId === partner.id).length}</strong></article>)}</section>
      </div>
    </div>
  );
}
