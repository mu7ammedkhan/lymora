import Link from "next/link";
import { ArrowRight, Filter, Plus } from "lucide-react";
import { ProofTabs } from "@/components/os/ProofTabs";
import { requireRole } from "@/lib/os/auth";
import { proofEngagementLabels, proofStatusLabels } from "@/lib/os/proof";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function OutcomeReportsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const { q = "", status = "" } = await searchParams;
  const query = q.toLowerCase().trim();
  const database = await readDatabase();
  const accountById = new Map(database.corporateAccounts.map((item) => [item.id, item]));
  const reports = database.outcomeReports.filter((report) => {
    const account = report.accountId ? accountById.get(report.accountId) : null;
    return (!query || [report.title, report.reportNumber, report.engagementType, account?.companyName].some((value) => value?.toLowerCase().includes(query))) && (!status || report.status === status);
  });

  return <div className="os-page os-proof-page">
    <div className="os-page-head"><div><span className="os-label">Measured delivery</span><h1>Outcome reports</h1><p>Build a client-approved evidence record before turning a result into a claim or expansion offer.</p></div><Link href="/app/proof/reports/new" className="os-button"><Plus size={16} /> New report</Link></div>
    <ProofTabs active="reports" />
    <div className="os-workforce-filterbar"><Filter size={15} /><Link href="/app/proof/reports" className={!status ? "is-active" : ""}>All <span>{database.outcomeReports.length}</span></Link>{["draft", "review", "approved", "published"].map((item) => <Link href={`/app/proof/reports?status=${item}`} className={status === item ? "is-active" : ""} key={item}>{proofStatusLabels[item as keyof typeof proofStatusLabels]} <span>{database.outcomeReports.filter((report) => report.status === item).length}</span></Link>)}</div>
    <section className="os-panel os-proof-register"><div className="os-table-wrap"><table className="os-table"><thead><tr><th>Report</th><th>Client / engagement</th><th>Period</th><th>Evidence</th><th>Status</th><th aria-label="Open" /></tr></thead><tbody>{reports.map((report) => { const metrics = database.outcomeMetrics.filter((item) => item.outcomeReportId === report.id); const account = report.accountId ? accountById.get(report.accountId) : null; return <tr key={report.id}><td><Link href={`/app/proof/reports/${report.id}`}><strong className="os-cell-primary">{report.title}</strong><small>{report.reportNumber}</small></Link></td><td><strong>{account?.companyName ?? proofEngagementLabels[report.engagementType]}</strong><small>{proofEngagementLabels[report.engagementType]}</small></td><td><strong>{formatDate(report.periodEnd)}</strong><small>from {formatDate(report.periodStart)}</small></td><td><strong>{metrics.filter((item) => item.verified).length}/{metrics.length}</strong><small>metrics verified</small></td><td><span className={`os-proof-state is-${report.status}`}>{proofStatusLabels[report.status]}</span></td><td><Link href={`/app/proof/reports/${report.id}`} className="os-row-open" aria-label={`Open ${report.reportNumber}`}><ArrowRight size={15} /></Link></td></tr>; })}</tbody></table></div>{reports.length === 0 && <div className="os-quiet-empty">No reports match this view.</div>}</section>
  </div>;
}
