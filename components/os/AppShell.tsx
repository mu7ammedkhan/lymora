"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  UserSearch,
  X,
} from "lucide-react";
import { LymoraMark } from "@/components/Logo";
import { logoutAction } from "@/app/login/actions";
import { roleLabels, type SafeUser } from "@/lib/os/types";

const staffNavigation = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "Admissions", href: "/app/admissions", icon: UserSearch, roles: ["super_admin", "academy_ops", "assessor"] },
  { label: "Cohorts", href: "/app/cohorts", icon: BookOpenCheck, roles: ["super_admin", "academy_ops", "assessor"] },
  { label: "Corporate", href: "/app/corporate", icon: Building2, roles: ["super_admin", "academy_ops"] },
  { label: "Workforce", href: "/app/workforce", icon: BriefcaseBusiness, roles: ["super_admin", "academy_ops", "talent_ops"] },
  { label: "Proof & Expansion", href: "/app/proof", icon: ChartNoAxesCombined, roles: ["super_admin", "academy_ops", "talent_ops"] },
  { label: "Team", href: "/app/team", icon: Users, roles: ["super_admin"] },
  { label: "Activity", href: "/app/activity", icon: Activity, roles: ["super_admin", "academy_ops", "talent_ops"] },
  { label: "Settings", href: "/app/settings", icon: Settings, roles: ["super_admin"] },
] as const;

const candidateNavigation = [
  { label: "My programme", href: "/app", icon: LayoutDashboard },
  { label: "Learning & evidence", href: "/app/learning", icon: BookOpenCheck },
] as const;

const operatorNavigation = [
  { label: "My deployment", href: "/app/workforce/me", icon: BriefcaseBusiness },
] as const;

function getPageTitle(pathname: string) {
  if (pathname.includes("/proof/reports/") && !pathname.endsWith("/new")) return "Outcome report";
  if (pathname.endsWith("/proof/reports/new")) return "New outcome report";
  if (pathname.startsWith("/app/proof/partnerships")) return "Partnership growth";
  if (pathname.startsWith("/app/proof/specialisations")) return "Role specialisations";
  if (pathname.startsWith("/app/proof/reports")) return "Outcome reports";
  if (pathname.startsWith("/app/proof")) return "Proof & Expansion";
  if (pathname === "/app/workforce/me") return "My deployment";
  if (pathname.includes("/workforce/deployments/")) return "Deployment control";
  if (pathname.includes("/workforce/operators/")) return "Operator record";
  if (pathname === "/app/workforce/operators") return "Talent bench";
  if (pathname.startsWith("/app/workforce")) return "Workforce pilot";
  if (pathname.includes("/corporate/") && pathname.endsWith("/diagnostic")) return "AI readiness diagnostic";
  if (pathname.includes("/corporate/") && pathname.endsWith("/proposal")) return "Corporate proposals";
  if (pathname.includes("/corporate/") && pathname.endsWith("/workshops")) return "Enablement workshops";
  if (pathname.startsWith("/app/corporate/")) return "Corporate opportunity";
  if (pathname === "/app/corporate") return "Corporate growth";
  if (pathname.startsWith("/app/admissions/")) return "Applicant record";
  if (pathname === "/app/admissions") return "Admissions";
  if (pathname.includes("/delivery/")) return "Session attendance";
  if (pathname.endsWith("/delivery")) return "Academy delivery";
  if (pathname.includes("/assessment/")) return "Learner assessment";
  if (pathname.endsWith("/assessment")) return "Cohort gradebook";
  if (pathname.startsWith("/app/cohorts/")) return "Cohort workspace";
  if (pathname === "/app/cohorts") return "Cohorts";
  if (pathname === "/app/team") return "Team access";
  if (pathname === "/app/activity") return "Activity log";
  if (pathname === "/app/settings") return "Platform settings";
  if (pathname === "/app/learning") return "Learning and evidence";
  return "Command centre";
}

export function AppShell({ user, children }: { user: SafeUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigation = user.role === "candidate"
    ? candidateNavigation
    : user.role === "operator"
      ? operatorNavigation
      : staffNavigation.filter((item) => !("roles" in item) || item.roles.includes(user.role as never));

  return (
    <div className="os-app">
      <aside className={`os-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="os-brand">
          <Link href="/app" aria-label="Lymora OS home">
            <LymoraMark size={31} />
            <span>Lymora</span>
            <small>OS</small>
          </Link>
          <button type="button" className="os-icon-button os-sidebar-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <div className="os-workspace-label">Workspace</div>
        <nav className="os-navigation" aria-label="Platform navigation">
          {navigation.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : ""} onClick={() => setMenuOpen(false)}>
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="os-sidebar-foot">
          <div className="os-system-status"><i /> All systems operational</div>
          <span>Phase 5 - Proof and expansion</span>
        </div>
      </aside>

      {menuOpen && <button type="button" className="os-sidebar-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <div className="os-main">
        <header className="os-topbar">
          <div className="os-topbar-left">
            <button type="button" className="os-icon-button os-menu-trigger" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
            <div>
              <span className="os-topbar-kicker">{pathname.startsWith("/app/proof") ? "Lymora Evidence" : pathname.startsWith("/app/workforce") ? "Lymora Workforce" : pathname.startsWith("/app/corporate") ? "Lymora Corporate" : "Lymora Academy"}</span>
              <strong>{getPageTitle(pathname)}</strong>
            </div>
          </div>

          <div className="os-topbar-actions">
            {!["candidate", "operator"].includes(user.role) && (
              <form className="os-global-search" action={pathname.startsWith("/app/proof") ? "/app/proof/reports" : pathname.startsWith("/app/workforce") ? "/app/workforce/operators" : pathname.startsWith("/app/corporate") ? "/app/corporate" : "/app/admissions"}>
                <Search size={16} />
                <input name="q" aria-label={pathname.startsWith("/app/proof") ? "Search proof" : pathname.startsWith("/app/workforce") ? "Search operators" : pathname.startsWith("/app/corporate") ? "Search accounts" : "Search applicants"} placeholder={pathname.startsWith("/app/proof") ? "Search proof" : pathname.startsWith("/app/workforce") ? "Search operators" : pathname.startsWith("/app/corporate") ? "Search accounts" : "Search applicants"} />
              </form>
            )}
            <div className="os-profile-wrap">
              <button type="button" className="os-profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}>
                <span>{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                <div><strong>{user.name}</strong><small>{roleLabels[user.role]}</small></div>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="os-profile-menu">
                  <p><strong>{user.email}</strong><span>Signed in securely</span></p>
                  <form action={logoutAction}><button type="submit"><LogOut size={15} /> Sign out</button></form>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="os-content">{children}</div>
      </div>
    </div>
  );
}
