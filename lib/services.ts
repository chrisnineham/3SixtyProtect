export type ServiceIconName =
  | 'GraduationCap'
  | 'UserRoundCheck'
  | 'ClipboardCheck'
  | 'ScanEye'
  | 'Users'
  | 'Search';

export interface ServiceFact {
  label: string;
  value: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceApproachStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  heroBlurb: string;
  overview: string[];
  keyFacts: ServiceFact[];
  features: ServiceFeature[];
  whoFor: string[];
  approach: ServiceApproachStep[];
  icon: ServiceIconName;
  /** Optional decorative background image (path under /public). */
  image?: string;
  /** Crop focus for the card image (default 'top'). */
  imageFocus?: 'top' | 'center' | 'bottom';
  /** Optional full-bleed hero background image for the detail page (path under /public). */
  heroImage?: string;
  ctaLabel: string;
  ctaHref: string;
  href: string;
  hasDetail: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "training-sia-security-courses",
    image: "/images/DS1.png",
    name: "Training & SIA Security Courses",
    category: "Training",
    tagline: "Licence-linked SIA qualifications, taught by operators who work the field.",
    heroBlurb:
      "Accredited SIA training in Door Supervision and Close Protection, delivered to a standard set by people who protect for a living. The foundation of everything we do.",
    overview: [
      "Training is where 3Sixty Protect began, and it remains a core strength. We prepare candidates for the SIA licence-linked qualifications that underpin a career in UK private security, from Door Supervision through to Close Protection, with instruction grounded in real operational experience rather than classroom theory alone.",
      "Our courses map directly to the regulated qualifications the Security Industry Authority requires for licensing, so what you learn in the room translates straight into a licence application and paid work. Small cohorts, experienced tutors and a focus on the practical competencies that matter on the ground give candidates the confidence to perform from day one.",
      "Whether you are entering the industry for the first time or an established operator broadening your credentials, our training calendar runs regular course dates across the year. Browse upcoming intakes, or explore the Door Supervision and Close Protection pages for full syllabus detail.",
    ],
    keyFacts: [
      { label: "Awarding", value: "SIA Licence-Linked" },
      { label: "Delivery", value: "Classroom & Practical" },
      { label: "Cohorts", value: "Small Group" },
      { label: "Schedule", value: "Rolling Calendar" },
    ],
    features: [
      {
        title: "SIA Door Supervision",
        description:
          "The licence-linked qualification for door supervisors, covering conflict management, physical intervention and the legal and social responsibilities of the role.",
      },
      {
        title: "Close Protection",
        description:
          "Advanced training for aspiring CP operatives, spanning threat awareness, route planning, foot and vehicle drills and the operational discipline the work demands.",
      },
      {
        title: "Licence-Linked Qualifications",
        description:
          "Every course maps directly to the SIA requirements for licensing, so your training feeds straight into a valid licence application.",
      },
      {
        title: "Experienced Instructors",
        description:
          "Courses are led by practitioners with real field experience, so candidates learn how the work is actually done, not just how to pass an exam.",
      },
      {
        title: "Practical Assessment",
        description:
          "Scenario-based exercises and hands-on assessment build genuine competence and readiness before you step into a live role.",
      },
      {
        title: "Rolling Course Calendar",
        description:
          "Regular intakes throughout the year mean you can find a start date that fits, with clear joining information ahead of each course.",
      },
    ],
    whoFor: [
      "Newcomers seeking their first SIA licence and entry into the industry",
      "Working door supervisors renewing or broadening their qualifications",
      "Aspiring close protection operatives building toward CP work",
      "Ex-military and ex-police personnel transitioning into private security",
      "Employers upskilling or licensing their own security staff",
    ],
    approach: [
      {
        title: "Choose Your Course",
        description:
          "Browse the training calendar and select the qualification and date that fit your goals, from Door Supervision through to Close Protection.",
      },
      {
        title: "Learn From Operators",
        description:
          "Train in small cohorts with experienced instructors, combining classroom instruction with practical, scenario-based exercises.",
      },
      {
        title: "Assess & Qualify",
        description:
          "Complete the assessments mapped to SIA requirements to earn the licence-linked qualification your application depends on.",
      },
      {
        title: "Apply & Deploy",
        description:
          "Use your qualification to secure your SIA licence and step into paid work, with our wider services available as your career grows.",
      },
    ],
    icon: "GraduationCap",
    ctaLabel: "Browse Courses",
    ctaHref: "/calendar",
    href: "/calendar",
    hasDetail: false,
  },
  {
    slug: "executive-protection",
    image: "/images/ST4.png",
    heroImage: "/images/EPB1.png",
    name: "Executive Protection",
    category: "Close Protection",
    tagline: "Discreet, SIA-licensed protection for those who cannot afford to be exposed.",
    heroBlurb:
      "SIA-licensed close protection for individuals, executives, and families, low-profile officers, secure travel, and threat assessment delivered with total discretion.",
    overview: [
      "Executive protection is not about visible muscle. It is about ensuring that risk is identified and neutralised before it reaches the principal, quietly, professionally, and without disrupting the way you live or work. Every deployment begins with a threat and risk assessment, and every officer operates to a plan built around your movements, your environment, and your tolerance for exposure.",
      "Our Close Protection Officers are SIA-licensed and selected for judgement as much as capability. We favour a low-profile posture: protection that blends into the setting rather than drawing attention to it. From single-officer coverage to fully coordinated teams, residential security, and secure transport, each engagement is scaled to the actual risk picture: never over-sold, never under-resourced.",
      "Discretion is the foundation of everything we do. Client identities, movements, and arrangements are handled on a strict need-to-know basis, and confidentiality is treated as an operational requirement, not a courtesy.",
    ],
    keyFacts: [
      { label: "Officers", value: "SIA-Licensed CPOs" },
      { label: "Profile", value: "Low / Discreet" },
      { label: "Coverage", value: "UK & International" },
      { label: "Deployment", value: "By Assessment" },
    ],
    features: [
      {
        title: "Close Protection Officers",
        description:
          "SIA-licensed CPOs deployed as single officers or coordinated teams, matched to the assessed threat level and the principal's routine.",
      },
      {
        title: "Threat & Risk Assessment",
        description:
          "Structured evaluation of exposure, routes, venues, and vulnerabilities that shapes every operational plan before deployment begins.",
      },
      {
        title: "Secure Transport & Travel",
        description:
          "Vetted drivers, route planning, and advance reconnaissance for daily movements, business travel, and international itineraries.",
      },
      {
        title: "Residential Security",
        description:
          "Protective coverage at the home: access control, overnight presence, and integration with existing family and estate arrangements.",
      },
      {
        title: "Event & Venue Protection",
        description:
          "Advance surveys, controlled access, and discreet on-site coverage for private functions, public appearances, and high-profile occasions.",
      },
      {
        title: "Family & Household Protection",
        description:
          "Low-profile protection extended to partners, children, and household staff, including school runs and everyday movements.",
      },
    ],
    whoFor: [
      "Company executives and board-level principals",
      "High-net-worth individuals and their families",
      "Public figures, media personalities, and dignitaries",
      "Clients facing a specific, elevated, or emerging threat",
      "Visitors and delegations requiring UK-based coverage",
    ],
    approach: [
      {
        title: "Assess",
        description:
          "We conduct a confidential threat and risk assessment covering movements, environments, and known vulnerabilities.",
      },
      {
        title: "Plan",
        description:
          "We design a protection plan, officer numbers, posture, transport, and contingencies, scaled to the assessed risk.",
      },
      {
        title: "Deploy",
        description:
          "Vetted, SIA-licensed officers are deployed to the agreed profile, briefed fully and integrated into your routine.",
      },
      {
        title: "Review",
        description:
          "Coverage is monitored and adjusted as circumstances change, keeping the response proportionate to the current threat.",
      },
    ],
    icon: "UserRoundCheck",
    ctaLabel: "Request a confidential consultation",
    ctaHref: "/contact",
    href: "/services/executive-protection",
    hasDetail: true,
  },
  {
    slug: "security-risk-management-consultancy",
    image: "/images/ST5.png",
    heroImage: "/images/SRMC1.png",
    name: "Security Risk Management Consultancy",
    category: "Consultancy",
    tagline: "See the threat before it moves.",
    heroBlurb:
      "Independent security advisory that identifies your exposure, tests your defences, and translates risk into a clear, actionable strategy your organisation can act on with confidence.",
    overview: [
      "Effective security is not a product you buy. It is a position you hold, informed by an honest understanding of the threats you face and the gaps in your current posture. Our consultancy practice gives decision-makers that clarity. We assess, we challenge assumptions, and we set out what matters, in what order, and why.",
      "Working independently of any hardware or manpower agenda, we conduct structured security audits and surveys, threat and risk assessments, and physical penetration testing to establish where you are genuinely exposed. From that evidence base we build security strategy, policy, and contingency plans that fit your operating environment, your budget, and your appetite for risk.",
      "Every engagement is delivered discreetly and documented to a standard you can present to a board, an insurer, or a regulator. Our aim is not to generate alarm but to give you defensible, proportionate decisions, and a plan you can implement long after we have gone.",
    ],
    keyFacts: [
      { label: "Scope", value: "Physical & Operational" },
      { label: "Vetting", value: "SIA-Licensed Consultants" },
      { label: "Output", value: "Board-Ready Reporting" },
      { label: "Engagement", value: "UK-Wide" },
    ],
    features: [
      {
        title: "Security Audits & Surveys",
        description:
          "Systematic on-site review of your premises, procedures, and controls against recognised good practice to establish a clear baseline of your current posture.",
      },
      {
        title: "Threat & Risk Assessment",
        description:
          "Structured analysis of the threats specific to your people, sites, and operations, scored by likelihood and impact so resources go where they matter most.",
      },
      {
        title: "Physical Penetration Testing",
        description:
          "Authorised, controlled attempts to breach your physical security, access points, perimeters, and staff procedures, to expose vulnerabilities before an adversary does.",
      },
      {
        title: "Security Strategy & Policy",
        description:
          "Practical, proportionate security policies and a prioritised improvement roadmap aligned to your risk appetite, budget, and regulatory obligations.",
      },
      {
        title: "Crisis & Contingency Planning",
        description:
          "Response and escalation plans for security incidents, threats, and emergencies, developed and tested so your team knows exactly what to do under pressure.",
      },
      {
        title: "Business Continuity Advisory",
        description:
          "Planning to keep critical operations running through disruption, protecting people, assets, and reputation when events do not go as expected.",
      },
    ],
    whoFor: [
      "Corporate and commercial organisations protecting people, premises, and assets",
      "Facilities and estates managers responsible for multi-site security",
      "High-net-worth individuals and family offices managing personal risk",
      "Event organisers and venue operators requiring pre-event risk assessment",
      "Boards and insurers seeking independent assurance on security posture",
    ],
    approach: [
      {
        title: "Scope & Brief",
        description:
          "We meet to understand your operations, concerns, and objectives, then agree the scope, boundaries, and rules of engagement in writing before any work begins.",
      },
      {
        title: "Assess & Test",
        description:
          "We gather evidence through audits, surveys, interviews, and, where authorised, controlled penetration testing to establish your real-world exposure.",
      },
      {
        title: "Analyse & Report",
        description:
          "Findings are scored, prioritised, and set out in a clear written report with practical, costed recommendations you can act on immediately.",
      },
      {
        title: "Advise & Support",
        description:
          "We help you implement the plan, refine policy, and, if required, review progress to ensure improvements hold over time.",
      },
    ],
    icon: "ClipboardCheck",
    ctaLabel: "Request a Consultation",
    ctaHref: "/contact",
    href: "/services/security-risk-management-consultancy",
    hasDetail: true,
  },
  {
    slug: "technical-surveillance",
    image: "/images/ST6.png",
    heroImage: "/images/TACT1.png",
    name: "Technical Surveillance",
    category: "Surveillance",
    tagline: "See everything. Reveal nothing you don't intend to.",
    heroBlurb:
      "Evidence-grade surveillance systems, lawful covert operations, and technical counter-measures, designed, deployed, and monitored to a professional standard.",
    overview: [
      "Technical surveillance is where physical security meets the electronic domain. We design and deploy integrated systems, CCTV, access control, intruder detection, and monitoring, that give you clear visibility over your people, premises, and assets. Every deployment is planned around defined objectives, captured to an evidentiary standard, and built to hold up under scrutiny.",
      "Where discretion is required, we provide lawful covert surveillance and evidence gathering conducted within the bounds of applicable UK legislation, including data-protection and privacy law. Our counter-surveillance capability, technical surveillance counter-measures, or TSCM, sweeps premises, vehicles, and boardrooms for unauthorised recording and transmitting devices, protecting sensitive conversations before they leave the room.",
      "All work is delivered by vetted, appropriately licensed operators and documented with a clear chain of custody. We advise on what is proportionate and lawful for your situation, and we will tell you plainly where a proposed measure falls outside what the law permits.",
    ],
    keyFacts: [
      { label: "Standard", value: "Evidence-grade" },
      { label: "Coverage", value: "Fixed & covert" },
      { label: "Compliance", value: "UK data & privacy law" },
      { label: "Operators", value: "Vetted & licensed" },
    ],
    features: [
      {
        title: "CCTV & Video Systems",
        description:
          "Design, installation, and integration of surveillance camera systems with resilient storage and remote-viewing capability.",
      },
      {
        title: "Covert Surveillance & Evidence Gathering",
        description:
          "Lawful discreet observation and recording for corporate, legal, and investigative purposes, captured to an evidentiary standard.",
      },
      {
        title: "TSCM Bug Sweeps",
        description:
          "Technical surveillance counter-measures to detect and remove unauthorised listening, recording, and transmitting devices.",
      },
      {
        title: "Access Control Systems",
        description:
          "Electronic entry management, credential and biometric access, and audit logging across single or multiple sites.",
      },
      {
        title: "Alarm & Monitoring",
        description:
          "Intruder detection and alarm systems with round-the-clock monitoring and defined response escalation.",
      },
      {
        title: "System Audit & Integration",
        description:
          "Review of existing infrastructure and integration of disparate systems into a single, manageable security picture.",
      },
    ],
    whoFor: [
      "Corporate offices and boardrooms protecting sensitive commercial information",
      "Legal teams and investigators requiring admissible surveillance evidence",
      "High-net-worth individuals and private residences",
      "Retail, logistics, and industrial sites managing loss and access",
      "Property managers and landlords securing multi-site portfolios",
    ],
    approach: [
      {
        title: "Assessment & Objectives",
        description:
          "We survey the site or brief, define what needs to be seen or protected, and confirm the lawful basis for every measure proposed.",
      },
      {
        title: "Design & Specification",
        description:
          "We produce a proportionate technical design, coverage, equipment, storage, and monitoring, mapped to your objectives and budget.",
      },
      {
        title: "Deployment & Capture",
        description:
          "Licensed operators install, commission, and operate the solution, recording to an evidence-grade standard with clear chain of custody.",
      },
      {
        title: "Monitoring & Handover",
        description:
          "We provide ongoing monitoring, maintenance, and reporting, or hand over a fully documented system with training for your team.",
      },
    ],
    icon: "ScanEye",
    ctaLabel: "Discuss a surveillance requirement",
    ctaHref: "/contact",
    href: "/services/technical-surveillance",
    hasDetail: true,
  },
  {
    slug: "manpower-supply-management",
    image: "/images/ST1.png",
    imageFocus: "center",
    heroImage: "/images/MSM1.png",
    name: "Manpower Supply & Management",
    category: "Guarding",
    tagline: "SIA-licensed officers, deployed and managed to standard.",
    heroBlurb:
      "Vetted, SIA-licensed security officers supplied and fully managed on your behalf, from door supervision and static guarding to mobile patrols and event stewarding, with supervision and compliance handled end to end.",
    overview: [
      "We supply and manage SIA-licensed security personnel across a full range of guarding disciplines. Whether you need a single officer or a coordinated team, every deployment is vetted, briefed, supervised and documented, so you receive a managed service, not simply a body on site.",
    ],
    keyFacts: [
      { label: "Licensing", value: "SIA-licensed" },
      { label: "Vetting", value: "BS 7858 aligned" },
      { label: "Cover", value: "24/7" },
      { label: "Supervision", value: "Managed" },
    ],
    features: [
      {
        title: "Door Supervision",
        description:
          "Licensed door supervisors for licensed premises, venues and hospitality, managing access, capacity and conflict with professional restraint.",
      },
      {
        title: "Static & Site Security",
        description:
          "Manned guarding for construction sites, commercial premises, industrial estates and vacant properties, protecting assets around the clock.",
      },
      {
        title: "Retail & Corporate Guarding",
        description:
          "Uniformed officers for stores, receptions and corporate environments, combining security presence with a professional front-of-house manner.",
      },
      {
        title: "Event Stewarding & Crowd Management",
        description:
          "Stewards and security staff for events of all sizes, handling crowd flow, access control and safety in line with your event plan.",
      },
      {
        title: "Key Holding & Mobile Patrols",
        description:
          "Secure key holding, alarm response and scheduled mobile patrols providing a visible deterrent and rapid attendance out of hours.",
      },
      {
        title: "Vetting, Scheduling & Compliance",
        description:
          "Full management of officer vetting, rostering, cover, supervision and record-keeping so shifts are filled and standards are maintained.",
      },
    ],
    whoFor: [
      "Licensed premises, venues and hospitality operators",
      "Construction, property and facilities managers",
      "Retail and corporate sites requiring a guarding presence",
      "Event organisers and production companies",
      "Businesses needing key holding, alarm response and out-of-hours cover",
    ],
    approach: [
      {
        title: "Requirement & Site Assessment",
        description:
          "We review your site, risk profile and operational needs to define the roles, hours and officer profile required.",
      },
      {
        title: "Vetting & Selection",
        description:
          "Officers are screened, vetted and licence-checked, then matched to your assignment and briefed against site-specific instructions.",
      },
      {
        title: "Deployment & Supervision",
        description:
          "Personnel are rostered, deployed and actively supervised, with cover arranged for absence and quality monitored on an ongoing basis.",
      },
      {
        title: "Reporting & Review",
        description:
          "Shift records, incident reports and compliance documentation are maintained, with regular review to keep the service aligned to your needs.",
      },
    ],
    icon: "Users",
    ctaLabel: "Request Officers",
    ctaHref: "/contact",
    href: "/services/manpower-supply-management",
    hasDetail: true,
  },
  {
    slug: "private-investigations",
    image: "/images/ST2.png",
    name: "Private Investigations",
    category: "Investigations",
    tagline: "Discreet, lawful investigation. Evidence that stands up.",
    heroBlurb:
      "Confidential investigative services conducted lawfully and to evidential standards: surveillance, due diligence, fraud and corporate enquiries, tracing, and evidence gathering for legal proceedings.",
    overview: [
      "When facts are in doubt, decisions carry risk. Our private investigations service establishes what actually happened, quietly, lawfully, and to a standard that holds up under scrutiny. Every enquiry is scoped to a clear objective, conducted within the bounds of relevant legislation and data protection law, and documented so findings can be relied upon by you, your solicitor, or a court.",
      "We handle sensitive matters across the personal, commercial, and legal spectrum: covert and static surveillance, pre-employment and third-party due diligence, corporate and insurance fraud, asset and people tracing, and matrimonial or family enquiries. Investigators are experienced, discreet, and briefed to protect your interests and your reputation at every stage.",
      "Discretion is not a slogan here. It is the method. Instructions are handled on a need-to-know basis, evidence is preserved with a defensible chain of custody, and outcomes are reported factually, without embellishment. Where a matter cannot be pursued lawfully, we will tell you plainly rather than expose you to risk.",
    ],
    keyFacts: [
      { label: "Conduct", value: "Lawful & Discreet" },
      { label: "Reporting", value: "Evidential Standard" },
      { label: "Coverage", value: "UK-Wide" },
      { label: "Confidentiality", value: "Need-To-Know" },
    ],
    features: [
      {
        title: "Surveillance",
        description:
          "Covert, mobile, and static surveillance carried out lawfully by trained operatives, capturing time-stamped photographic and video evidence.",
      },
      {
        title: "Background Checks & Due Diligence",
        description:
          "Pre-employment screening and third-party checks on individuals or companies to verify identity, history, and integrity before you commit.",
      },
      {
        title: "Fraud & Corporate Investigations",
        description:
          "Enquiries into insurance fraud, employee dishonesty, and commercial wrongdoing, building a factual picture that supports internal or legal action.",
      },
      {
        title: "Tracing",
        description:
          "Locating debtors, missing persons, absent parties, and beneficiaries using lawful investigative methods and verified data sources.",
      },
      {
        title: "Matrimonial & Family Enquiries",
        description:
          "Sensitive, confidential enquiries handled with discretion and care for those navigating relationship or family disputes.",
      },
      {
        title: "Evidence Gathering for Legal Proceedings",
        description:
          "Structured evidence collection with a defensible chain of custody, supporting witness statements and disclosure ready for solicitors and the courts.",
      },
    ],
    whoFor: [
      "Solicitors and legal teams needing evidence for proceedings",
      "Businesses investigating fraud, dishonesty, or contractual breach",
      "Insurers and claims handlers assessing suspect claims",
      "HR and compliance teams conducting due diligence or screening",
      "Private individuals dealing with family, matrimonial, or tracing matters",
    ],
    approach: [
      {
        title: "Confidential Consultation",
        description:
          "We discuss your objective in confidence, assess whether it can be pursued lawfully, and agree a clear, proportionate scope of work.",
      },
      {
        title: "Investigation Plan",
        description:
          "We define methods, timelines, and reporting, ensuring every activity complies with relevant legislation and data protection requirements.",
      },
      {
        title: "Lawful Enquiry & Evidence Capture",
        description:
          "Investigators gather and preserve evidence discreetly, maintaining a defensible chain of custody throughout.",
      },
      {
        title: "Reporting & Support",
        description:
          "You receive a clear, factual report of findings, with supporting evidence and follow-up assistance for any legal or internal action.",
      },
    ],
    icon: "Search",
    ctaLabel: "Discuss a Confidential Enquiry",
    ctaHref: "/contact",
    href: "/services/private-investigations",
    hasDetail: true,
  },
];

export const DETAIL_SERVICES: Service[] = SERVICES.filter((s) => s.hasDetail);

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getDetailService(slug: string): Service | undefined {
  return DETAIL_SERVICES.find((s) => s.slug === slug);
}
