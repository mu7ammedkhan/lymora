import { ShieldCheck, UserPlus } from "lucide-react";
import { changeUserStatusAction, createTeamMemberAction } from "@/lib/os/actions";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";
import { roleLabels } from "@/lib/os/types";
import { formatDate, initials } from "@/lib/os/utils";

export default async function TeamPage() {
  const currentUser = await requireRole(["super_admin"]);
  const database = await readDatabase();
  return (
    <div className="os-page">
      <div className="os-page-head"><div><span className="os-label">Access control</span><h1>Team access</h1><p>Create role-scoped accounts and remove access immediately when responsibilities change.</p></div></div>
      <div className="os-dashboard-grid os-team-layout">
        <section className="os-panel os-table-panel">
          <div className="os-panel-head"><div><span className="os-label">Authorised users</span><h2>{database.users.length} accounts</h2></div><ShieldCheck size={19} /></div>
          <div className="os-table-wrap"><table className="os-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last sign in</th><th>Access</th></tr></thead><tbody>{database.users.map((user) => <tr key={user.id}><td><div className="os-person"><span>{initials(user.name)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td>{roleLabels[user.role]}</td><td><span className={`os-user-state is-${user.status}`}><i />{user.status}</span></td><td>{user.lastLoginAt ? formatDate(user.lastLoginAt, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "Never"}</td><td>{user.id === currentUser.id ? <small>Current account</small> : <form action={changeUserStatusAction}><input type="hidden" name="userId" value={user.id} /><input type="hidden" name="status" value={user.status === "active" ? "disabled" : "active"} /><button className="os-table-action" type="submit">{user.status === "active" ? "Disable" : "Enable"}</button></form>}</td></tr>)}</tbody></table></div>
        </section>
        <aside className="os-panel os-team-form">
          <div className="os-panel-head"><div><span className="os-label">New account</span><h2>Add team member</h2></div><UserPlus size={19} /></div>
          <p>Create an initial password and share it through a secure channel.</p>
          <form action={createTeamMemberAction}>
            <label>Full name<input name="name" required /></label><label>Email address<input type="email" name="email" required /></label>
            <label>Access role<select name="role" defaultValue="academy_ops"><option value="academy_ops">Academy Operations</option><option value="talent_ops">Talent & Deployment</option><option value="assessor">Assessor</option><option value="candidate">Candidate</option><option value="operator">AI Operator</option><option value="super_admin">Super Admin</option></select></label>
            <label>Initial password<input type="password" name="password" minLength={10} required /></label>
            <button type="submit" className="os-button"><UserPlus size={15} /> Create account</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
