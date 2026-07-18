export const siteConfig = {
  name: "Lymora",
  legalName: "LSM Workforce Technologies LLC",
  tagline: "Human Meets Intelligence",
  description:
    "Lymora builds AI-ready professionals, teams and workforces through practical certification, team enablement and managed AI workforce solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lymoraops.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@lymoraops.com",
  calendarUrl:
    process.env.NEXT_PUBLIC_CALENDAR_URL || "https://calendly.com/your-link",
  location: "Dubai, United Arab Emirates",
  social: {
    instagram: "https://instagram.com/lymoraops",
    linkedin: "https://linkedin.com/company/lymoraops"
  }
} as const;

export const mainNav = [
  { label: "Workforce", href: "/ai-workforce" },
  { label: "Academy", href: "/academy" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Solutions", href: "/ai-solutions" },
  { label: "Insights", href: "/insights" },
] as const;

export const aiSolutions = [
  {
    slug: "ai-consulting-dubai",
    name: "AI Consulting in Dubai",
    searchIntent: "AI consulting Dubai, AI consultants UAE, AI strategy consulting",
    headline: "AI consulting for practical business adoption in Dubai.",
    summary:
      "Lymora helps leadership teams assess AI opportunities, prioritise workflows, build responsible adoption plans and turn AI strategy into operating capability.",
    audience: "Business owners, founders, transformation leaders and department heads in the UAE.",
    outcomes: ["AI opportunity map", "Workflow priority list", "Responsible AI adoption roadmap", "Leadership decision brief"],
    services: ["AI readiness assessment", "Workflow discovery workshops", "Governance and risk planning", "Implementation support"],
    faqs: [
      ["What does an AI consultant do?", "An AI consultant helps a business identify practical AI use cases, assess readiness, manage risk and turn ideas into workflows, policies and adoption plans."],
      ["Can Lymora support implementation after the strategy?", "Yes. Lymora connects consulting with team enablement, professional certification and managed AI workforce deployment."],
      ["Is this only for large companies?", "No. The process can be sized for a department, growing business or enterprise transformation programme."]
    ]
  },
  {
    slug: "ai-training-dubai",
    name: "AI Training in Dubai",
    searchIntent: "AI training Dubai, AI courses UAE, corporate AI training",
    headline: "AI training that changes how teams work.",
    summary:
      "Practical AI training for professionals and teams, focused on workplace workflows, human review, productivity and responsible adoption.",
    audience: "Professionals, teams, managers and HR leaders building AI capability.",
    outcomes: ["Role-specific AI skills", "Prompting and workflow confidence", "Responsible use standards", "Evidence-based learning outcomes"],
    services: ["CAIO™ certification", "Team AI enablement", "AI-ready professional programmes", "Leadership AI briefings"],
    faqs: [
      ["What is the best AI training for employees?", "The best AI training is role-specific, practical and tied to real workflows, rather than generic tool demonstrations."],
      ["Does Lymora offer certification?", "Yes. The CAIO™ programme certifies applied AI, workflow design and responsible automation capability."],
      ["Can training be customised by department?", "Yes. Lymora adapts training for sales, marketing, operations, support, education, real estate and other functions."]
    ]
  },
  {
    slug: "ai-automation-services",
    name: "AI Automation Services",
    searchIntent: "AI automation services, workflow automation, business automation AI",
    headline: "AI automation with human oversight built in.",
    summary:
      "Identify, design and improve AI-assisted workflows for repeatable business processes while keeping accountability, verification and governance clear.",
    audience: "Teams with repetitive research, communication, documentation, reporting or operational work.",
    outcomes: ["Mapped automation candidates", "Documented workflows", "Human review checkpoints", "Productivity and quality baselines"],
    services: ["Workflow audit", "AI-assisted process design", "No-code automation planning", "Team playbooks"],
    faqs: [
      ["Which workflows should be automated first?", "Start with repeatable, information-heavy workflows that have clear inputs, outputs and human review points."],
      ["Does automation remove staff?", "Lymora focuses on human-led automation where people define intent and verify outcomes while AI supports execution."],
      ["Can automation work without changing every system?", "Often yes. Many early improvements come from role workflows, templates, review standards and light automation before deep system changes."]
    ]
  },
  {
    slug: "generative-ai-for-business",
    name: "Generative AI for Business",
    searchIntent: "generative AI for business, gen AI adoption, AI productivity business",
    headline: "Generative AI adoption for real business work.",
    summary:
      "Move from experimentation to repeatable generative AI use in research, communication, content, reporting, analysis and decision support.",
    audience: "Leaders and teams who want productive AI use without uncontrolled tool sprawl.",
    outcomes: ["Approved use-case library", "Team prompting standards", "Workflow-specific examples", "Risk and review guidance"],
    services: ["Use-case discovery", "Team enablement", "Responsible AI policies", "Pilot workflow design"],
    faqs: [
      ["How can businesses use generative AI?", "Common starting points include research summaries, document drafting, customer communication, content planning, reporting and internal knowledge workflows."],
      ["What are the risks of generative AI?", "Risks include inaccurate outputs, privacy exposure, inconsistent quality and unclear accountability. Each workflow needs human review and usage standards."],
      ["How do we move beyond experiments?", "Choose priority workflows, set baselines, define review steps and train the people responsible for the work."]
    ]
  },
  {
    slug: "ai-readiness-assessment",
    name: "AI Readiness Assessment",
    searchIntent: "AI readiness assessment, AI maturity assessment, AI audit",
    headline: "Know where your organisation is ready for AI.",
    summary:
      "Assess workflows, people, data, governance and adoption maturity before investing in tools or large transformation programmes.",
    audience: "Executives, transformation leads, HR leaders and department owners.",
    outcomes: ["Readiness scorecard", "Capability gap analysis", "Priority workflow shortlist", "90-day adoption plan"],
    services: ["Leadership interviews", "Workflow review", "Risk and governance assessment", "Roadmap presentation"],
    faqs: [
      ["What is an AI readiness assessment?", "It is a structured review of people, workflows, data, governance and business priorities to determine where AI adoption should begin."],
      ["How long does it take?", "A focused assessment can start with a short discovery sprint and expand depending on the number of teams and workflows involved."],
      ["What happens after the assessment?", "The next step may be team enablement, CAIO™ certification, workflow redesign or managed workforce deployment."]
    ]
  },
  {
    slug: "ai-workforce-solutions",
    name: "AI Workforce Solutions",
    searchIntent: "AI workforce solutions, AI employees, AI-enabled workforce",
    headline: "Build an AI-enabled workforce, not just an AI tool stack.",
    summary:
      "Lymora combines training, workflow design, deployment and ongoing support so organisations can create measurable AI capability.",
    audience: "Businesses that need productivity, capacity and capability without losing human accountability.",
    outcomes: ["AI-enabled roles", "Managed workforce support", "Role playbooks", "Performance improvement cycles"],
    services: ["Role design", "Recruitment and training", "AI workforce subscription", "Continuous enablement"],
    faqs: [
      ["What is an AI workforce?", "An AI workforce is a group of trained professionals using AI inside controlled workflows with human accountability and review."],
      ["Is this different from software implementation?", "Yes. Lymora focuses on people, workflow and operating capability, supported by appropriate tools."],
      ["What roles can be AI-enabled?", "Common roles include executive assistants, sales support, marketing operators, customer support, operations coordinators and research assistants."]
    ]
  },
  {
    slug: "corporate-ai-training-dubai",
    name: "Corporate AI Training in Dubai",
    searchIntent: "corporate AI training Dubai, AI training for employees UAE, enterprise AI workshops",
    headline: "Corporate AI training built around your team’s real work.",
    summary: "Move employees from scattered experimentation to shared, role-specific and governed AI capability through diagnostics, live training, workflow playbooks and implementation support.",
    audience: "HR leaders, learning teams, department heads and organisations developing practical employee AI capability.",
    outcomes: ["Team capability baseline", "Role-specific workflow library", "Department AI playbook", "30-day implementation plan"],
    services: ["AI readiness diagnostic", "Custom live training", "Manager coaching", "Post-programme outcome report"],
    faqs: [
      ["What should corporate AI training include?", "Effective corporate AI training should combine role-specific practice, responsible-use rules, workflow design, manager support and an implementation plan."],
      ["Can training be delivered for one department?", "Yes. Lymora scopes programmes around department workflows such as sales, marketing, operations, customer service or executive support."],
      ["Does the programme focus on one AI tool?", "No. Lymora teaches vendor-neutral operating capability so teams can apply sound methods across appropriate tools."]
    ]
  },
  {
    slug: "ai-leadership-training-dubai",
    name: "AI Leadership Training in Dubai",
    searchIntent: "AI leadership training Dubai, executive AI programme UAE, AI training for managers",
    headline: "Lead responsible AI adoption with clarity and evidence.",
    summary: "Equip executives and managers to evaluate opportunities, govern risk, redesign work and lead the workforce change required for practical AI adoption.",
    audience: "Executives, founders, functional leaders, managers and transformation sponsors.",
    outcomes: ["Leadership decision framework", "AI opportunity and risk map", "Workforce change priorities", "Governance action plan"],
    services: ["Executive AI briefing", "Leadership workshop", "Readiness review", "Adoption advisory"],
    faqs: [
      ["Do leaders need technical AI skills?", "Leaders need enough technical understanding to evaluate limits, risk and feasibility, but their core responsibility is deciding where AI creates value and how humans remain accountable."],
      ["What is covered in AI leadership training?", "Topics include opportunity selection, governance, human oversight, workforce change, value measurement and implementation leadership."],
      ["Can this be delivered privately?", "Yes. Leadership programmes can be delivered for an executive group or management team using organisation-specific priorities."]
    ]
  },
  {
    slug: "ai-workflow-audit",
    name: "AI Workflow Audit",
    searchIntent: "AI workflow audit, AI process assessment, workflow automation audit",
    headline: "Find the workflows where AI can create responsible, measurable value.",
    summary: "Map current processes, identify friction and repetition, classify risk and create a prioritised register of AI-assisted workflow opportunities.",
    audience: "Operations leaders, department owners and transformation teams deciding where AI implementation should begin.",
    outcomes: ["Current-state workflow maps", "Opportunity register", "Risk classification", "Prioritised implementation backlog"],
    services: ["Workflow interviews", "Process mapping", "Value and feasibility scoring", "Executive recommendations"],
    faqs: [
      ["What is an AI workflow audit?", "It is a structured review of recurring work to identify where AI can improve time, quality or consistency while preserving human accountability."],
      ["How are workflows prioritised?", "Lymora assesses business value, repetition, data sensitivity, process stability, implementation feasibility and required human controls."],
      ["What happens after the audit?", "Priority workflows can move into an implementation sprint, team enablement programme or managed AI operations engagement."]
    ]
  },
  {
    slug: "responsible-ai-governance",
    name: "Responsible AI Governance",
    searchIntent: "responsible AI governance UAE, AI policy for companies, AI risk framework",
    headline: "Create practical AI governance that teams can actually use.",
    summary: "Establish approved-use standards, risk classification, human review requirements and documented controls for responsible workplace AI adoption.",
    audience: "Leadership, legal, risk, HR, IT and operations teams responsible for organisational AI use.",
    outcomes: ["AI use policy", "Green-amber-red risk model", "Human oversight matrix", "Incident and review process"],
    services: ["Governance assessment", "AI operating playbook", "Risk classification", "Leadership and employee guidance"],
    faqs: [
      ["What is responsible AI governance?", "Responsible AI governance defines who may use AI, for which work, with what data, under which controls and with what level of human approval."],
      ["Does a small business need an AI policy?", "Any organisation using AI with client, employee or commercially sensitive information benefits from clear, proportionate rules."],
      ["How does Lymora classify AI risk?", "Workflows are grouped into green, amber and red risk levels, with stronger review and approval requirements as potential impact increases."]
    ]
  },
  {
    slug: "ai-implementation-services-dubai",
    name: "AI Implementation Services in Dubai",
    searchIntent: "AI implementation services Dubai, generative AI implementation UAE, AI adoption consulting",
    headline: "Move from AI strategy to controlled implementation.",
    summary: "Design, test and document priority AI-assisted workflows with clear ownership, human verification, operating procedures and adoption measures.",
    audience: "Organisations that have identified AI opportunities and need practical implementation support.",
    outcomes: ["Tested workflow prototypes", "Standard operating procedures", "Human review criteria", "Adoption and value measures"],
    services: ["Implementation sprint", "Workflow prototyping", "SOP and playbook design", "Team onboarding"],
    faqs: [
      ["What does an AI implementation project include?", "A focused project includes workflow design, prototype testing, risk controls, documentation, user enablement and success measures."],
      ["Does Lymora build custom AI software?", "Lymora begins with workforce and workflow capability. Specialist software or automation can be included where it is necessary for the approved workflow."],
      ["How do you reduce implementation risk?", "Lymora starts with controlled pilots, defined human approval, documented baselines and staged expansion."]
    ]
  },
  {
    slug: "managed-ai-operations",
    name: "Managed AI Operations",
    searchIntent: "managed AI services UAE, managed AI operations, AI operations outsourcing",
    headline: "Operate and improve AI-enabled work as a managed capability.",
    summary: "Combine certified operators, workflow quality assurance, coaching, reporting and continuous improvement in one recurring managed service.",
    audience: "Growing businesses and enterprise teams that need ongoing AI-enabled execution without building a complete internal function.",
    outcomes: ["Managed operator capacity", "Monthly quality reviews", "Workflow performance reporting", "Continuous capability improvement"],
    services: ["Certified operator deployment", "Quality assurance", "Monthly coaching", "Workflow improvement recommendations"],
    faqs: [
      ["What are managed AI operations?", "Managed AI operations combine people, AI-assisted workflows, quality controls and ongoing improvement under a recurring service model."],
      ["How is performance managed?", "Roles begin with defined responsibilities, baselines and review criteria, followed by coaching, quality checks and client reporting."],
      ["Can the service expand to more roles?", "Yes. Organisations can begin with one operator and expand into multiple functions as workflows and governance mature."]
    ]
  }
] as const;

export const operatorRoles = [
  {
    slug: "ai-executive-assistant",
    name: "AI Executive Assistant",
    headline: "Executive support amplified by controlled AI workflows.",
    summary: "A trained professional supporting research, reporting, meetings, communication and executive coordination with human verification built into every material output.",
    responsibilities: ["Executive research and briefings", "Meeting preparation and follow-up", "Reporting and document workflows", "Communication and coordination"],
    workflows: ["Daily executive brief", "Meeting intelligence workflow", "Decision and action tracker", "Verified research pack"]
  },
  {
    slug: "ai-marketing-operator",
    name: "AI Marketing Operator",
    headline: "Increase marketing capacity without lowering strategic or creative standards.",
    summary: "An AI-enabled marketing professional operating research, content, campaign and reporting workflows under brand and human quality controls.",
    responsibilities: ["Campaign and audience research", "Content production systems", "Performance reporting", "Marketing workflow automation"],
    workflows: ["Campaign research brief", "Human-reviewed content workflow", "Weekly performance summary", "Competitor intelligence update"]
  },
  {
    slug: "ai-sales-operator",
    name: "AI Sales Operator",
    headline: "Give sales teams better research, preparation and follow-through.",
    summary: "A trained operator supporting account research, outreach preparation, CRM administration and structured follow-up while salespeople retain relationship ownership.",
    responsibilities: ["Account and prospect research", "Outreach preparation", "CRM quality and updates", "Follow-up workflow support"],
    workflows: ["Account intelligence brief", "Meeting preparation pack", "CRM hygiene workflow", "Opportunity follow-up system"]
  },
  {
    slug: "ai-operations-operator",
    name: "AI Operations Operator",
    headline: "Turn recurring operational work into documented, improving systems.",
    summary: "An AI-enabled operations professional supporting SOPs, reporting, process mapping, documentation and controlled workflow improvement.",
    responsibilities: ["SOP and process documentation", "Operational reporting", "Workflow mapping", "Controlled automation support"],
    workflows: ["SOP creation and review", "Operations reporting cycle", "Process issue register", "Workflow improvement log"]
  },
  {
    slug: "ai-customer-experience-operator",
    name: "AI Customer Experience Operator",
    headline: "Improve response quality and consistency while keeping service human.",
    summary: "A trained customer experience professional using AI for response preparation, knowledge operations, triage and quality support under clear escalation rules.",
    responsibilities: ["Response drafting and quality", "Knowledge base maintenance", "Ticket triage support", "Service insight reporting"],
    workflows: ["Verified response workflow", "Knowledge article lifecycle", "Escalation and triage model", "Voice-of-customer summary"]
  },
  {
    slug: "ai-recruitment-operator",
    name: "AI Recruitment Operator",
    headline: "Increase recruitment capacity with accountable human decisions.",
    summary: "An AI-enabled recruitment professional supporting sourcing, screening administration, candidate communication and onboarding without delegating material hiring decisions to AI.",
    responsibilities: ["Sourcing research", "Screening administration", "Candidate communication", "Onboarding workflow support"],
    workflows: ["Sourcing research brief", "Candidate communication workflow", "Interview preparation pack", "Onboarding coordination system"]
  }
] as const;

export const methodologies = [
  { name: "CLEAR™ Instruction Framework", summary: "Context, Limitations, Expected outcome, Audience and approach, Review criteria." },
  { name: "HITL Workflow Model™", summary: "Human intent, AI-supported execution, Human verification, Recorded outcome and Continuous improvement." },
  { name: "Lymora AI Risk Classification", summary: "Green, amber and red workflow risk levels with proportionate human controls." },
  { name: "AI Workforce Framework™", summary: "Recruit, Train, Certify, Deploy, Manage and Improve." },
  { name: "Lymora AI Readiness Score", summary: "Measures leadership, people, process, data, tools, governance and adoption." },
  { name: "Value Realisation Canvas", summary: "Captures baselines, time saved, quality, cost, adoption and risk." }
] as const;

export const industries = [
  {
    slug: "education",
    name: "Education",
    summary: "Enable educators, administrators and support teams to use AI safely and productively.",
    challenges: ["Administrative workload", "Content and lesson planning", "Responsible student use", "Staff capability gaps"],
    outcomes: ["Faster planning and documentation", "AI usage guidance", "Role-based staff workflows", "Practical team playbook"]
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Improve non-clinical operations while keeping human oversight, privacy and risk controls central.",
    challenges: ["High documentation burden", "Sensitive information", "Patient communication", "Operational consistency"],
    outcomes: ["Controlled administrative workflows", "Human review checkpoints", "Staff AI literacy", "Documented governance"]
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    summary: "Equip sales, marketing and operations teams to handle research, follow-up and documentation more effectively.",
    challenges: ["Lead response delays", "Repetitive follow-up", "Listing and campaign content", "Fragmented processes"],
    outcomes: ["Faster lead workflows", "Consistent communication", "AI-assisted research", "Documented sales operations"]
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    summary: "Turn expertise into repeatable, verified workflows for research, proposals and client delivery.",
    challenges: ["Research time", "Proposal production", "Knowledge reuse", "Quality control"],
    outcomes: ["Verified research workflows", "Reusable knowledge systems", "Faster proposals", "Clear review standards"]
  },
  {
    slug: "marketing-agencies",
    name: "Marketing Agencies",
    summary: "Build AI-enabled delivery systems without lowering strategic or creative standards.",
    challenges: ["Content volume pressure", "Inconsistent quality", "Reporting workload", "Tool fragmentation"],
    outcomes: ["Structured production workflows", "Human-led quality review", "Faster research and reporting", "Team-wide operating standards"]
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    summary: "Support guest communication, team productivity and operational consistency with practical AI capability.",
    challenges: ["High message volume", "Multilingual communication", "Training consistency", "Operational handovers"],
    outcomes: ["Faster service communication", "Role-based prompt systems", "Improved handovers", "Responsible staff adoption"]
  }
] as const;

export const insights = [
  {
    slug: "what-is-an-ai-workforce",
    title: "What Is an AI Workforce?",
    description: "A practical explanation of AI-enabled teams, how they operate and where human oversight belongs.",
    category: "AI Workforce",
    date: "2026-07-18",
    readingTime: "6 min",
    answer:
      "An AI workforce is a group of professionals who use AI as part of controlled, repeatable work processes. The value comes from capable people, clear workflows, verification and governance—not from tools alone.",
    sections: [
      { heading: "What makes a workforce AI-enabled?", paragraphs: ["An AI-enabled workforce is defined by operating capability, not software access. People understand which tasks are suitable for AI, how to provide context, how to verify outputs and when to escalate decisions.", "The strongest model connects role responsibilities, approved tools, documented workflows, human review criteria and measurable outcomes."], points: ["Role-specific AI capability", "Documented human-in-the-loop workflows", "Approved data and usage boundaries", "Quality and performance measures"] },
      { heading: "The Recruit, Train, Certify, Deploy and Manage model", paragraphs: ["Lymora’s AI Workforce Framework™ begins before deployment. Professionals are selected for role fit, developed through applied learning, assessed through evidence and then onboarded into client-specific context and controls.", "Ongoing coaching and quality assurance matter because AI tools, workflows and organisational risks continue to change."], points: ["Recruit for role and baseline capability", "Train through practical workplace tasks", "Certify demonstrated competence", "Deploy into clear responsibilities and SOPs", "Manage quality, adoption and improvement"] },
      { heading: "Where organisations can begin", paragraphs: ["Good starting roles contain recurring information work with clear outputs and accountable human ownership. Executive support, marketing operations, sales support, customer experience, recruitment administration and operational documentation are common examples.", "The role should begin with a baseline for time, quality, volume or service. Without a baseline, the organisation cannot distinguish activity from improvement."], points: [] }
    ]
  },
  {
    slug: "ai-training-vs-ai-enablement",
    title: "AI Training vs AI Enablement: What Businesses Actually Need",
    description: "Why one-off tool demonstrations rarely change how teams work, and what a complete enablement programme includes.",
    category: "Team Enablement",
    date: "2026-07-18",
    readingTime: "7 min",
    answer:
      "AI training teaches knowledge or tool use. AI enablement turns that knowledge into role-specific workflows, controls, adoption plans and measurable operating improvements.",
    sections: [
      { heading: "Why one-off AI training rarely changes operations", paragraphs: ["A demonstration can increase awareness without changing behaviour. Employees return to the same responsibilities, systems and approval processes without a shared method for applying what they learned.", "Generic prompting sessions also leave managers without visibility into risk, adoption or business value."], points: ["No role-specific use cases", "No workflow ownership", "No responsible-use standard", "No implementation plan", "No measurement baseline"] },
      { heading: "What complete AI enablement includes", paragraphs: ["Enablement begins with a diagnostic of current capability and priority work. Training is then built around department use cases, followed by playbooks, manager coaching and a short implementation cycle.", "The goal is not tool familiarity. The goal is repeatable performance inside approved workflows."], points: ["Readiness and skills diagnostic", "Department workflow audit", "Custom live training", "Role-specific instruction library", "Responsible-AI guidance", "30-day implementation plan"] },
      { heading: "How leaders should measure success", paragraphs: ["Attendance and satisfaction are useful delivery signals, but they do not prove operating value. Leaders should also track adoption, cycle time, quality, rework, risk incidents and the number of workflows used consistently.", "Evidence should be reviewed after the programme and used to decide which workflows, teams or managed roles should scale next."], points: [] }
    ]
  },
  {
    slug: "how-to-choose-ai-workflows",
    title: "How to Choose the Right Workflows for AI",
    description: "A risk-aware method for deciding which processes to improve first.",
    category: "Workflow Design",
    date: "2026-07-18",
    readingTime: "8 min",
    answer:
      "Start with repetitive, information-heavy tasks that have clear inputs, outputs and human review. Avoid beginning with high-risk decisions or poorly understood processes.",
    sections: [
      { heading: "The characteristics of a strong first workflow", paragraphs: ["The best early workflows are stable enough to document, frequent enough to matter and measurable enough to evaluate. The responsible person must be able to explain what a good output looks like and remain accountable for review.", "Research briefs, meeting preparation, document drafting, reporting and knowledge maintenance often provide better starting points than high-risk decisions."], points: ["Clear inputs and outputs", "Repeatable information handling", "Defined human approval", "Manageable data risk", "Measurable time or quality baseline"] },
      { heading: "Score value, feasibility and risk together", paragraphs: ["A workflow with high theoretical value may be a poor first pilot if the process is unstable, data is highly sensitive or ownership is unclear. Lymora evaluates value and feasibility alongside a green, amber and red risk classification.", "Green workflows can use standard review. Amber workflows require stronger controls and approval. Red workflows should not be automated without specialist governance and accountable decision ownership."], points: ["Business value", "Process stability", "Data sensitivity", "Implementation effort", "Human review requirements"] },
      { heading: "Pilot before scaling", paragraphs: ["Document the current process and baseline, then run a controlled implementation sprint. Capture errors, review effort, time saved and user feedback.", "Scale only after the workflow produces repeatable evidence. The objective is a reliable operating process, not a technically impressive demonstration."], points: [] }
    ]
  }
] as const;
