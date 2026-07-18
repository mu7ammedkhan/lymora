"use client";

import { FormEvent, useRef, useState } from "react";

const steps = ["Profile", "Capability", "Commitment"];

export function CaioApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "email" | "error">("idle");

  const track = (event: string, detail: Record<string, unknown> = {}) => {
    window.dispatchEvent(new CustomEvent("lymora:analytics", { detail: { event, ...detail } }));
  };

  const validateStep = () => {
    const fieldset = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = Array.from(fieldset?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") || []);
    const invalid = fields.find(field => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    const next = Math.min(step + 1, steps.length);
    setStep(next);
    track("caio_application_step", { step: next });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) return;
    setStatus("submitting");

    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const endpoint = process.env.NEXT_PUBLIC_CAIO_APPLICATION_ENDPOINT || "/api/applications";
    track("caio_application_submit");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Application endpoint returned an error");
      setStatus("sent");
      track("caio_application_success");
    } catch {
      setStatus("error");
      track("caio_application_error");
    }
  };

  if (status === "sent") {
    return (
      <div className="caio-form-success" role="status">
        <strong>Application received.</strong>
        <p>Your application has been received. The Lymora Academy team will review it and contact shortlisted candidates. Submission does not guarantee admission.</p>
      </div>
    );
  }

  return (
    <form className="caio-application-form" ref={formRef} onSubmit={submit}>
      <div className="caio-form-progress" aria-label={`Application step ${step} of ${steps.length}`}>
        <div><span>Step {step} of {steps.length}</span><strong>{steps[step - 1]}</strong></div>
        <progress value={step} max={steps.length}>{step} of {steps.length}</progress>
      </div>

      <fieldset data-step="1" hidden={step !== 1}>
        <legend>Professional profile</legend>
        <div className="caio-form-grid">
          <label>Full name<input name="Full name" autoComplete="name" required /></label>
          <label>Email<input type="email" name="Email" autoComplete="email" required /></label>
          <label>Mobile / WhatsApp<input type="tel" name="Mobile or WhatsApp" autoComplete="tel" required /></label>
          <label>Country and city<input name="Country and city" autoComplete="address-level2" required /></label>
          <label>Current role<input name="Current role" required /></label>
          <label>Industry<input name="Industry" required /></label>
          <label>Years of professional experience
            <select name="Professional experience" required defaultValue="">
              <option value="" disabled>Select experience</option>
              <option>Less than 2 years</option><option>2–5 years</option><option>6–10 years</option><option>More than 10 years</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset data-step="2" hidden={step !== 2}>
        <legend>Capability and ambition</legend>
        <div className="caio-form-grid">
          <label>Current use of AI
            <select name="Current use of AI" required defaultValue="">
              <option value="" disabled>Select current level</option>
              <option>New to workplace AI</option><option>Occasional user</option><option>Regular user</option><option>Already building workflows</option>
            </select>
          </label>
          <label>Preferred operator track
            <select name="Preferred operator track" required defaultValue="">
              <option value="" disabled>Select a track</option>
              <option>Operations</option><option>Executive support</option><option>Marketing and content</option><option>Sales and research</option><option>HR and recruitment</option><option>Customer experience</option>
            </select>
          </label>
          <label className="full">What workflow would you like to improve?<textarea name="Workflow to improve" rows={4} required /></label>
          <label className="full">Why is CAIO™ important to you now?<textarea name="Why CAIO now" rows={4} required /></label>
        </div>
      </fieldset>

      <fieldset data-step="3" hidden={step !== 3}>
        <legend>Commitment and eligibility</legend>
        <div className="caio-form-grid">
          <label>Can you commit to the live schedule and assessments?
            <select name="Schedule commitment" required defaultValue="">
              <option value="" disabled>Select response</option><option>Yes</option><option>No</option><option>I need to confirm the schedule</option>
            </select>
          </label>
          <label>Are you prepared to invest AED 2,250 if accepted?
            <select name="Investment readiness" required defaultValue="">
              <option value="" disabled>Select response</option><option>Yes</option><option>Yes, with a payment plan</option><option>No</option>
            </select>
          </label>
          <label className="full">LinkedIn profile<input type="url" name="LinkedIn profile" placeholder="https://linkedin.com/in/..." /></label>
          <label className="caio-consent full">
            <input type="checkbox" name="Consent" value="Granted" required />
            <span>I consent to Lymora reviewing this information for CAIO™ admissions and contacting me about my application. I understand that submission does not guarantee acceptance.</span>
          </label>
        </div>
      </fieldset>

      <div className="caio-form-actions">
        {step > 1 && <button type="button" className="caio-back" onClick={() => setStep(step - 1)}>← Back</button>}
        {step < steps.length ? (
          <button type="button" className="button" onClick={nextStep}>Continue <span>→</span></button>
        ) : (
          <button type="submit" className="button" disabled={status === "submitting"}>{status === "submitting" ? "Submitting…" : "Submit Eligibility Application"} <span>↗</span></button>
        )}
      </div>
      {status === "email" && <p className="caio-form-notice" role="status">Your email app has opened with the completed application. Send that message to finish submitting.</p>}
      {status === "error" && <p className="caio-form-error" role="alert">The application could not be submitted. Please try again or contact Lymora through WhatsApp.</p>}
    </form>
  );
}
