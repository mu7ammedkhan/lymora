import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarRange, Clock3, Gauge, Layers3, Plus, Video } from "lucide-react";
import { CohortTabs } from "@/components/os/CohortTabs";
import { createCohortSessionAction, updateCohortModuleStatusAction } from "@/lib/os/actions";
import { effectiveModuleStatus } from "@/lib/os/academy";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate } from "@/lib/os/utils";

export default async function CohortDeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["super_admin", "academy_ops", "assessor"]);
  const { id } = await params;
  const database = await readDatabase();
  const cohort = database.cohorts.find((item) => item.id === id);
  if (!cohort) notFound();
  const canManage = user.role !== "assessor";
  const modules = database.cohortModules
    .filter((item) => item.cohortId === cohort.id)
    .map((cohortModule) => ({ cohortModule, module: database.learningModules.find((item) => item.id === cohortModule.moduleId) }))
    .filter((item) => item.module)
    .sort((a, b) => (a.module?.sortOrder ?? 0) - (b.module?.sortOrder ?? 0));
  const sessions = database.cohortSessions.filter((item) => item.cohortId === cohort.id).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const nextSession = sessions.find((item) => new Date(item.startsAt) > new Date() && item.status !== "cancelled");
  const deliveryHours = sessions.filter((item) => item.status !== "cancelled").reduce((total, item) => total + (new Date(item.endsAt).getTime() - new Date(item.startsAt).getTime()) / 3_600_000, 0);
  const recordedSessions = new Set(database.attendanceRecords.filter((record) => sessions.some((session) => session.id === record.sessionId)).map((record) => record.sessionId)).size;

  return (
    <div className="os-page os-academy-page">
      <Link href={`/app/cohorts/${cohort.id}`} className="os-back-link"><ArrowLeft size={15} /> {cohort.code}</Link>
      <div className="os-page-head"><div><span className="os-label">Academy delivery</span><h1>{cohort.name}</h1><p>Control the five-week pathway, live schedule and attendance evidence.</p></div></div>
      <CohortTabs cohortId={cohort.id} active="delivery" />

      <div className="os-academy-metrics">
        <div><Layers3 size={17} /><span>Published pathway<strong>{modules.length} modules</strong></span></div>
        <div><Video size={17} /><span>Live schedule<strong>{sessions.length} sessions</strong></span></div>
        <div><Clock3 size={17} /><span>Scheduled delivery<strong>{deliveryHours} hours</strong></span></div>
        <div><Gauge size={17} /><span>Attendance recorded<strong>{recordedSessions}/{sessions.length} sessions</strong></span></div>
      </div>

      <div className="os-academy-layout">
        <div className="os-academy-main">
          <section className="os-panel os-module-plan">
            <div className="os-panel-head"><div><span className="os-label">Programme pathway</span><h2>Five weeks, sequenced for evidence</h2></div><small>36-hour standard</small></div>
            <div className="os-module-plan-list">{modules.map(({ cohortModule, module }) => module && (() => {
              const state = effectiveModuleStatus(cohortModule.status, cohortModule.opensAt);
              const moduleSessions = sessions.filter((session) => session.moduleId === module.id);
              return <article key={cohortModule.id} className={state === "open" ? "is-open" : state === "completed" ? "is-complete" : ""}>
                <span className="os-module-index">{String(module.weekNumber).padStart(2, "0")}</span>
                <div><span>{module.competencyDomain}</span><h3>{module.title}</h3><p>{module.summary}</p><small>{moduleSessions.length} live sessions · Due {formatDate(cohortModule.dueAt, { day: "numeric", month: "short" })}</small></div>
                {canManage ? <form action={updateCohortModuleStatusAction}><input type="hidden" name="cohortId" value={cohort.id} /><input type="hidden" name="cohortModuleId" value={cohortModule.id} /><select name="status" defaultValue={cohortModule.status}><option value="locked">Locked</option><option value="open">Open</option><option value="completed">Completed</option></select><button type="submit" className="os-icon-action" aria-label={`Update ${module.title}`}><ArrowRight size={14} /></button></form> : <span className={`os-state-pill is-${state}`}>{state}</span>}
              </article>;
            })())}</div>
          </section>

          <section className="os-panel os-session-schedule">
            <div className="os-panel-head"><div><span className="os-label">Live schedule</span><h2>Sessions and attendance</h2></div>{nextSession && <small>Next: {formatDate(nextSession.startsAt, { day: "numeric", month: "short" })}</small>}</div>
            <div className="os-session-list">{sessions.map((session) => {
              const module = database.learningModules.find((item) => item.id === session.moduleId);
              const records = database.attendanceRecords.filter((item) => item.sessionId === session.id).length;
              return <Link href={`/app/cohorts/${cohort.id}/delivery/${session.id}`} key={session.id}>
                <time><strong>{formatDate(session.startsAt, { day: "2-digit" })}</strong><span>{formatDate(session.startsAt, { month: "short" }).toUpperCase()}</span></time>
                <div><span>{module?.code ?? "Programme"}</span><h3>{session.title}</h3><small>{formatDate(session.startsAt, { weekday: "short", hour: "numeric", minute: "2-digit" })} · {session.deliveryMode.replaceAll("_", " ")}</small></div>
                <div><span className={`os-state-pill is-${session.status}`}>{session.status}</span><small>{records} attendance records</small></div>
                <ArrowRight size={15} />
              </Link>;
            })}</div>
          </section>
        </div>

        <aside className="os-academy-side">
          <section className="os-panel os-next-delivery">
            <CalendarRange size={19} />
            <span className="os-label">Next live session</span>
            {nextSession ? <><h2>{nextSession.title}</h2><p>{formatDate(nextSession.startsAt, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}</p><Link href={`/app/cohorts/${cohort.id}/delivery/${nextSession.id}`} className="os-button os-button-secondary">Open session <ArrowRight size={14} /></Link></> : <p>No future session is scheduled.</p>}
          </section>

          {canManage && <section className="os-panel os-create-session">
            <div className="os-panel-head"><div><span className="os-label">Schedule control</span><h2>Add a session</h2></div><Plus size={18} /></div>
            <form action={createCohortSessionAction} className="os-compact-form">
              <input type="hidden" name="cohortId" value={cohort.id} />
              <label>Module<select name="moduleId" defaultValue=""><option value="">Programme-wide</option>{modules.map(({ module }) => module && <option key={module.id} value={module.id}>{module.code} · {module.title}</option>)}</select></label>
              <label>Session title<input name="title" required minLength={3} placeholder="Session focus" /></label>
              <div><label>Starts<input name="startsAt" type="datetime-local" required /></label><label>Ends<input name="endsAt" type="datetime-local" required /></label></div>
              <label>Delivery<select name="deliveryMode" defaultValue="live_online"><option value="live_online">Live online</option><option value="in_person">In person</option><option value="hybrid">Hybrid</option></select></label>
              <label>Join URL<input name="joinUrl" type="url" placeholder="https://" /></label>
              <button type="submit" className="os-button"><Plus size={14} /> Add session</button>
            </form>
          </section>}
        </aside>
      </div>
    </div>
  );
}
