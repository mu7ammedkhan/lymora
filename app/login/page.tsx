import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/login/actions";
import { LymoraMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/os/auth";
import { wantsSupabase } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign in to Lymora OS", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentUser()) redirect("/app");
  const { error } = await searchParams;

  return (
    <div className="os-login">
      <section className="os-login-brand">
        <Link href="/" className="os-login-wordmark"><LymoraMark size={34} /><span>Lymora</span></Link>
        <div className="os-login-statement">
          <span>THE OPERATING LAYER</span>
          <h1>Capability,<br /><em>made visible.</em></h1>
          <p>One secure environment for admissions, learning, certification and workforce readiness.</p>
        </div>
        <div className="os-login-proof"><ShieldCheck size={17} /><span>Role-based access</span><i /><span>Audited activity</span></div>
      </section>

      <section className="os-login-panel">
        <Link href="/" className="os-login-back"><ArrowLeft size={15} /> Return to website</Link>
        <div className="os-login-form-wrap">
          <div className="os-login-icon"><LockKeyhole size={21} /></div>
          <span className="os-label">Lymora OS</span>
          <h2>Welcome back.</h2>
          <p>Sign in with your authorised Lymora account.</p>
          {error && <div className="os-login-error" role="alert">The email or password is incorrect. Please try again.</div>}
          <form action={loginAction} className="os-login-form">
            <label>Email address<input type="email" name="email" autoComplete="email" placeholder="name@lymoraops.com" required /></label>
            <label>Password<input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" minLength={8} required /></label>
            <button type="submit">Sign in securely <ArrowRight size={16} /></button>
          </form>
          {process.env.NODE_ENV !== "production" && !wantsSupabase() && (
            <div className="os-demo-access">
              <strong>Local preview access</strong>
              <code>admin@lymoraops.com</code>
              <code>LymoraAdmin!2026</code>
            </div>
          )}
        </div>
        <small className="os-login-legal">Protected workspace · LSM Workforce Technologies LLC</small>
      </section>
    </div>
  );
}
