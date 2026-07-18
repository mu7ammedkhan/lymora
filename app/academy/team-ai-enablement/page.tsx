import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs, CTA, FAQ, SectionHeading } from "@/components/UI";
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Corporate AI Training in Dubai | Team AI Enablement",
  description:
    "Practical corporate AI training in Dubai with workflow redesign, role-based playbooks, governance guidance and a 30-day implementation plan.",
  path: "/academy/team-ai-enablement",
  keywords: [
    "corporate AI training Dubai",
    "AI training for companies UAE",
    "team AI enablement",
    "enterprise AI workshop Dubai",
    "AI skills training UAE"
  ]
});

const faq = [
  {
    q: "How is this different from a one-off AI workshop?",
    a: "The programme combines a readiness diagnostic, role-specific workflows, live training, a department playbook, manager guidance and a 30-day implementation plan. The objective is sustained operating capability, not short-term tool awareness."
  },
  {
    q: "How many people can attend?",
    a: "Lymora offers a programme for teams of up to 15 and an expanded programme for teams of up to 30. Larger or multi-department engagements are scoped separately."
  },
  {
    q: "Can the programme be customised?",
    a: "Yes. Use cases, exercises, governance controls and workflow priorities are adapted to the organisation, department, systems and information-risk profile."
  },
  {
    q: "What does the organisation receive?",
    a: "Typical deliverables include a readiness diagnostic, private live delivery, role-specific use cases, workflow templates, a department AI playbook, a management outcome report and a post-programme implementation clinic."
  }
];

export default function TeamPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Team AI Enablement",
            description:
              "Corporate AI training and workflow enablement for teams in the UAE, including diagnostics, role-based learning, governance and implementation planning.",
            path: "/academy/team-ai-enablement",
            audience: "Companies and organisational departments",
            offers: [
              "AI readiness diagnostic",
              "Private team training",
              "Role-specific workflow design",
              "Department AI playbook",
              "Management outcome report",
              "Implementation clinic"
            ]
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Academy", path: "/academy" },
            { name: "Team AI Enablement", path: "/academy/team-ai-enablement" }
          ]),
          faqSchema(faq)
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Academy", href: "/academy" },
              { label: "Team AI Enablement" }
            ]}
          />
          <span className="eyebrow">Corporate AI training in Dubai</span>
          <h1>Move your team from AI awareness to operational capability.</h1>
          <p>
            Build shared skills, role-specific workflows and responsible operating standards through a practical
            programme designed around your organisation.
          </p>
          <div className="hero-actions">
            <Link href="/contact?interest=team-enablement" className="button">
              Request a team proposal
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading eyebrow="The programme" title="Assess. Train. Implement. Measure." />
          <div className="cards-3">
            {[
              ["01", "AI readiness diagnostic", "Understand current capability, workflows, risks and adoption barriers."],
              ["02", "Role-based learning", "Teach practical use through demonstrations, applied labs and department-specific scenarios."],
              ["03", "Workflow redesign", "Turn high-value activities into repeatable human-plus-AI workflows with clear review points."],
              ["04", "Responsible-use controls", "Define what information can be used, when verification is required and where humans retain authority."],
              ["05", "Department playbook", "Document approved tools, prompts, workflows, escalation rules and operating standards."],
              ["06", "30-day implementation", "Give managers a sequenced plan, outcome measures and a follow-up implementation clinic."]
            ].map(([number, title, description]) => (
              <div className="card" key={title}>
                <span className="card-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section">
        <div className="container">
          <SectionHeading
            eyebrow="Programme options"
            title="A clear scope for teams at different stages."
            text="Pricing follows the company blueprint. Final scope depends on delivery format, customisation and implementation requirements."
          />
          <div className="cards-3">
            <div className="card">
              <span className="card-number">Up to 15 participants</span>
              <h3>AED 12,500</h3>
              <p>Private team enablement with practical training, priority workflows and an implementation plan.</p>
            </div>
            <div className="card">
              <span className="card-number">Up to 30 participants</span>
              <h3>AED 22,500</h3>
              <p>Expanded delivery for a larger team, including role-based use cases and management guidance.</p>
            </div>
            <div className="card">
              <span className="card-number">Private CAIO cohort</span>
              <h3>AED 32,500</h3>
              <p>Professional CAIO certification for up to 12 participants, delivered as a private cohort.</p>
              <Link className="text-link" href="/caio">
                Explore CAIO certification <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading eyebrow="Frequently asked questions" title="Planning your team programme." />
          <FAQ items={faq} />
        </div>
      </section>

      <CTA
        title="Build an AI-enabled department."
        text="Share your team size, department and current priorities. Lymora will recommend the right scope and delivery format."
        primary="Request a proposal"
        primaryHref="/contact?interest=team-enablement"
      />
    </>
  );
}
