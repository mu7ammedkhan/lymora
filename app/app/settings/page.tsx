import { Database, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/os/auth";
import { readDatabase } from "@/lib/os/store";

export default async function SettingsPage() {
  await requireRole(["super_admin"]);
  const database = await readDatabase();
  const activeSessions = database.sessions.filter((session) => new Date(session.expiresAt) > new Date()).length;
  return (
    <div className="os-page">
      <div className="os-page-head"><div><span className="os-label">Platform administration</span><h1>Settings</h1><p>Security posture and infrastructure status for this Phase 1 environment.</p></div></div>
      <div className="os-settings-grid">
        <section className="os-panel os-security-overview"><div className="os-security-icon"><ShieldCheck size={24} /></div><span className="os-label">Security posture</span><h2>Protected by default.</h2><p>Sessions are server validated, cookies are HTTP-only, passwords are bcrypt hashed and role checks are enforced for every protected operation.</p><div className="os-security-facts"><div><strong>{activeSessions}</strong><span>Active sessions</span></div><div><strong>7d</strong><span>Session lifetime</span></div><div><strong>12</strong><span>Password hash rounds</span></div></div></section>
        <section className="os-panel os-setting-list"><Setting icon={<KeyRound size={18} />} title="Authentication" text="Email and password with revocable server sessions" status="Operational" /><Setting icon={<LockKeyhole size={18} />} title="Authorization" text="Role controls for Super Admin, Academy Operations, Assessor and Candidate" status="Operational" /><Setting icon={<Database size={18} />} title="Data environment" text="Portable local Phase 1 store; managed PostgreSQL migration prepared for production" status="Local" /></section>
      </div>
    </div>
  );
}

function Setting({ icon, title, text, status }: { icon: React.ReactNode; title: string; text: string; status: string }) {
  return <div className="os-setting-row"><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div><small>{status}</small></div>;
}
