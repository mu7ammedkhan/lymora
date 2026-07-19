import { Activity as ActivityIcon } from "lucide-react";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { formatDate, initials } from "@/lib/os/utils";

export default async function ActivityPage() {
  await requireRole(["super_admin", "academy_ops", "talent_ops"]);
  const database = await readDatabase();
  const users = new Map(database.users.map((user) => [user.id, user]));
  return (
    <div className="os-page">
      <div className="os-page-head"><div><span className="os-label">Governance</span><h1>Activity log</h1><p>A chronological record of access, decisions and operational changes.</p></div></div>
      <section className="os-panel os-audit-panel">
        <div className="os-panel-head"><div><span className="os-label">System of record</span><h2>Latest events</h2></div><ActivityIcon size={19} /></div>
        <div className="os-audit-list">{database.activities.map((activity) => {
          const actor = activity.actorId ? users.get(activity.actorId) : undefined;
          return <div key={activity.id}><div className="os-audit-avatar">{actor ? initials(actor.name) : "SY"}</div><div><strong>{activity.detail}</strong><span>{actor?.name ?? "System"} · {activity.action}</span></div><time>{formatDate(activity.createdAt, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</time></div>;
        })}</div>
      </section>
    </div>
  );
}
