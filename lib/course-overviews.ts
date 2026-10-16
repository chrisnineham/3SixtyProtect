// ─────────────────────────────────────────────────────────────
// Overview pages for every course type that doesn't have its own
// full landing page (Door Supervision and Close Protection keep
// theirs, in course-content.ts).
//
// Deliberately omitted: course length, entry requirements,
// assessment method, awarding organisation and price. Those vary by
// awarding body and intake, and nothing here should state a fact that
// hasn't been confirmed. Live dates, locations and prices come from
// the courses table instead, so the pages stay accurate on their own.
// ─────────────────────────────────────────────────────────────

export interface CourseOverview {
  /** Matches course_types.key. */
  key: string;
  /** URL segment under /courses. */
  slug: string;
  /** Read straight off the qualification title, so it needs no separate source. */
  level: string;
  /** Hero background image under /public. */
  heroImage: string;
  /** One or two sentences under the hero heading. */
  summary: string;
  /** "What it is" body copy. */
  whatIs: string[];
  whoFor: string[];
  covered: string[];
  outcomes: string[];
  seo: { title: string; description: string };
}

export const COURSE_OVERVIEWS: CourseOverview[] = [
  // ── Licence-linked security qualifications ──────────────────
  {
    key: 'security_officer',
    slug: 'security-officer',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The licence-linked qualification for working as a security officer, guarding people, premises and property across commercial, retail and industrial sites.',
    whatIs: [
      'Security officers protect premises, assets and the people inside them. The work spans corporate reception and office buildings, retail parks, warehouses, construction sites and manned guarding contracts, and it calls for sound judgement, clear communication and an understanding of where your legal authority begins and ends.',
      'This qualification covers the knowledge the role demands, from the legislation that governs private security through to patrolling, access control, reporting and responding when something goes wrong. It is the training route for anyone applying for an SIA security guarding licence.',
    ],
    whoFor: [
      'Anyone starting a career in manned guarding',
      'Applicants for an SIA security guarding licence',
      'Reception, concierge and facilities staff moving into security',
      'Door supervisors widening the roles they can take',
      'Employers putting new site teams through formal training',
    ],
    covered: [
      'The private security industry and the role of the SIA',
      'Legislation relevant to a security officer',
      'Patrolling, access control and site security',
      'Health and safety and safe working practices',
      'Emergency procedures and incident response',
      'Communication, record keeping and reporting',
      'Fire safety awareness',
      'Counter-terrorism awareness',
    ],
    outcomes: [
      'A recognised Level 2 security officer qualification',
      'Eligibility to apply for an SIA security guarding licence',
      'The legal grounding the role requires',
      'Confidence handling incidents and emergencies on site',
    ],
    seo: {
      title: 'SIA Security Officer Training (Level 2)',
      description:
        'Level 2 Award for Security Officers in the Private Security Industry (RQF). The licence-linked qualification for manned guarding roles. Training in London and nationwide.',
    },
  },
  {
    key: 'cctv_operator',
    slug: 'cctv-operator',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The licence-linked qualification for operating public space surveillance systems, the route to an SIA CCTV licence.',
    whatIs: [
      'CCTV operators monitor public space surveillance systems in town centre control rooms, shopping centres, transport hubs, stadiums and large commercial sites. Done well, the role prevents crime rather than simply recording it, and that depends on knowing how to observe, track and hand over evidence properly.',
      'This qualification covers the practical operation of surveillance equipment alongside the legal duties that come with watching people. Anyone applying for an SIA public space surveillance licence needs it.',
    ],
    whoFor: [
      'Anyone wanting to work in a CCTV control room',
      'Applicants for an SIA public space surveillance licence',
      'Security officers moving into surveillance work',
      'Retail and town centre staff monitoring camera systems',
      'Control room teams needing a formal qualification',
    ],
    covered: [
      'The role and responsibilities of a CCTV operator',
      'Operating CCTV equipment and control room systems',
      'Codes of practice and operational procedures',
      'Data protection, privacy and the law around surveillance',
      'Identifying and tracking subjects across a camera network',
      'Preserving and handing over evidence',
      'Working with the police and emergency services',
      'Reporting, logging and control room communication',
    ],
    outcomes: [
      'A recognised Level 2 CCTV operator qualification',
      'Eligibility to apply for an SIA public space surveillance licence',
      'Practical control room and camera handling skills',
      'A clear understanding of your legal duties when monitoring the public',
    ],
    seo: {
      title: 'SIA CCTV Operator Training (Level 2, Public Space Surveillance)',
      description:
        'Level 2 Award for CCTV Operators (Public Space Surveillance) (RQF). The licence-linked qualification for control room and surveillance roles.',
    },
  },
  {
    key: 'close_protection_international',
    slug: 'close-protection-international',
    level: 'Level 3 Certificate',
    heroImage: '/images/LDN.png',
    summary:
      'Close protection training geared to operating internationally, for operatives working outside the UK or on cross-border assignments.',
    whatIs: [
      'Protecting a principal abroad brings problems that a domestic assignment does not: unfamiliar legal systems, variable infrastructure, long transit routes, local fixers and security providers of uneven quality, and a far greater reliance on advance planning.',
      'This certificate covers the core discipline of close protection with that international context running through it, from threat assessment and operational planning to working as part of a team a long way from home support.',
    ],
    whoFor: [
      'Operatives taking assignments outside the UK',
      'Close protection officers working with travelling principals',
      'Those working on corporate or NGO overseas deployments',
      'Experienced security professionals moving into CP work abroad',
      'Teams supporting high net worth clients internationally',
    ],
    covered: [
      'Threat and risk assessment in unfamiliar environments',
      'Operational and route planning',
      'Reconnaissance and advance work',
      'Team roles, briefings and command structures',
      'Secure transport and embus and debus drills',
      'Venue and residence security',
      'Working with local providers and liaison',
      'Incident response and emergency planning',
    ],
    outcomes: [
      'A recognised Level 3 close protection certificate',
      'Planning skills suited to international assignments',
      'Practical experience of team-based protective operations',
      'Readiness for work with travelling and overseas principals',
    ],
    seo: {
      title: 'Close Protection (International) Training (Level 3)',
      description:
        'Level 3 Certificate for Close Protection Operatives (International) (RQF). Close protection training for operatives working on overseas and cross-border assignments.',
    },
  },

  // ── Refresher / top-up training ─────────────────────────────
  {
    key: 'door_supervisor_refresher',
    slug: 'door-supervisor-refresher',
    level: 'Level 2 Award',
    heroImage: '/images/DS2.png',
    summary:
      'Top-up training for door supervisors renewing an SIA licence, bringing your skills and knowledge back up to the current standard.',
    whatIs: [
      'Door supervision changes. Legislation moves on, guidance is updated, and the skills that matter most on the door, particularly physical intervention and conflict management, need refreshing rather than simply remembering.',
      'This refresher is taken by licence holders when renewing, revisiting the practical skills and bringing you up to date with current requirements so you can work with confidence rather than relying on what you learned the first time round.',
    ],
    whoFor: [
      'Door supervisors renewing an SIA licence',
      'Licence holders who have been out of the role for a while',
      'Working door staff wanting to sharpen practical skills',
      'Venue teams keeping their training current',
    ],
    covered: [
      'Current legislation and how the role has changed',
      'Conflict management and de-escalation',
      'Physical intervention skills and safe restraint',
      'Searching, ejections and incident handling',
      'Emergency first aid awareness',
      'Counter-terrorism awareness',
    ],
    outcomes: [
      'Refreshed practical and physical intervention skills',
      'An up to date understanding of current requirements',
      'The training element needed when renewing your licence',
      'Renewed confidence handling incidents on the door',
    ],
    seo: {
      title: 'SIA Door Supervisor Refresher Training (Level 2)',
      description:
        'Level 2 Award for Door Supervisors in the Private Security Industry (Refresher) (RQF). Top-up training for door supervisors renewing an SIA licence.',
    },
  },
  {
    key: 'security_officer_refresher',
    slug: 'security-officer-refresher',
    level: 'Level 2 Award',
    heroImage: '/images/ST2.png',
    summary:
      'Top-up training for security officers renewing an SIA licence, revisiting the core skills and current requirements.',
    whatIs: [
      'Guarding work rewards consistency, and consistency slips when training is years old. Legislation is updated, emergency and counter-terrorism guidance changes, and incident handling benefits from being practised rather than recalled.',
      'This refresher is taken by security officers when renewing a licence. It revisits the knowledge the role depends on and brings you up to date with where the standards sit now.',
    ],
    whoFor: [
      'Security officers renewing an SIA licence',
      'Guards returning to the industry after a break',
      'Site teams keeping their training current',
      'Officers wanting to sharpen incident response skills',
    ],
    covered: [
      'Current legislation affecting security officers',
      'Patrolling, access control and site security',
      'Conflict management and communication',
      'Emergency procedures and incident response',
      'Health, safety and fire awareness',
      'Counter-terrorism awareness',
    ],
    outcomes: [
      'Refreshed knowledge across the core areas of the role',
      'An up to date understanding of current requirements',
      'The training element needed when renewing your licence',
      'Renewed confidence responding to incidents on site',
    ],
    seo: {
      title: 'SIA Security Officer Refresher Training (Level 2)',
      description:
        'Level 2 Award for Security Officers in the Private Security Industry (Refresher) (RQF). Top-up training for security officers renewing an SIA licence.',
    },
  },
  {
    key: 'close_protection_refresher',
    slug: 'close-protection-refresher',
    level: 'Level 2 Award',
    heroImage: '/images/CPTRAINING.png',
    summary:
      'Top-up training for close protection operatives renewing an SIA licence, revisiting the skills the role depends on.',
    whatIs: [
      'Close protection is a perishable skill set. Drills degrade, planning habits slip, and operatives who have spent time on other work benefit from getting hands back on the practical side before their next assignment.',
      'This refresher is taken by CP licence holders when renewing. It revisits threat assessment, planning and team drills, and brings you up to date with where current practice and requirements sit.',
    ],
    whoFor: [
      'Close protection operatives renewing an SIA licence',
      'CPOs returning to protective work after other roles',
      'Operatives wanting to sharpen team drills',
      'Teams keeping their training current between contracts',
    ],
    covered: [
      'Current legislation and operating requirements',
      'Threat and risk assessment',
      'Operational planning and reconnaissance',
      'Team drills and formations',
      'Secure transport and route awareness',
      'Incident response and emergency procedures',
    ],
    outcomes: [
      'Refreshed close protection skills and drills',
      'An up to date understanding of current requirements',
      'The training element needed when renewing your licence',
      'Renewed operational confidence ahead of your next assignment',
    ],
    seo: {
      title: 'SIA Close Protection Refresher Training (Level 2)',
      description:
        'Level 2 Award for Close Protection Operatives in the Private Security Industry (Refresher) (RQF). Top-up training for CPOs renewing an SIA licence.',
    },
  },

  // ── Specialist security skills ──────────────────────────────
  {
    key: 'conflict_management',
    slug: 'conflict-management',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Practical training in recognising, defusing and safely managing conflict, for anyone whose job brings them into contact with the public.',
    whatIs: [
      'Most confrontations are lost or won before anyone raises a hand. Conflict management is the discipline of reading a situation early, managing your own response, and using communication to bring the temperature down rather than up.',
      'This qualification covers how conflict develops, the signals that precede it, and the techniques that resolve it safely. It is valuable well beyond security, in any role where people deal with frustrated, distressed or aggressive members of the public.',
    ],
    whoFor: [
      'Security and door staff',
      'Retail, hospitality and transport workers',
      'Reception, housing and customer-facing staff',
      'Healthcare and public service workers',
      'Employers meeting a duty of care to frontline teams',
    ],
    covered: [
      'How and why conflict develops',
      'Recognising warning and danger signs early',
      'Communication skills and active listening',
      'De-escalation and defusing techniques',
      'Managing your own reactions under pressure',
      'Problem solving and resolution',
      'Post-incident reporting and support',
    ],
    outcomes: [
      'A recognised Level 2 conflict management qualification',
      'Practical de-escalation techniques you can use immediately',
      'Greater confidence in confrontational situations',
      'A safer approach to managing difficult behaviour',
    ],
    seo: {
      title: 'Conflict Management Training (Level 2)',
      description:
        'Level 2 Award in Conflict Management (RQF). Practical de-escalation and conflict resolution training for frontline and customer-facing staff.',
    },
  },
  {
    key: 'behavioural_analysis',
    slug: 'behavioural-analysis',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Introductory training in understanding crowds and recognising the behaviours that signal a risk to safety and security at public events.',
    whatIs: [
      'This qualification provides introductory level knowledge of the principles behind planning for public events, built on understanding the people expected to attend, how they are likely to behave, and how to recognise behaviours that might present a risk to safety and security.',
      'It supports roles that provide protection from crime and antisocial behaviour, giving staff a structured way to read a crowd rather than relying on instinct alone.',
    ],
    whoFor: [
      'Event and festival security staff',
      'Venue and stewarding teams',
      'Security officers working crowded places',
      'Event planners and safety officers',
      'Anyone involved in planning for public events',
    ],
    covered: [
      'Principles of planning for public events',
      'Building an understanding of an expected crowd',
      'How groups and crowds behave',
      'Recognising behaviours that present a risk',
      'Antisocial behaviour and crime prevention',
      'Reporting concerns and escalating appropriately',
    ],
    outcomes: [
      'A recognised Level 2 behavioural analysis qualification',
      'A structured way to read crowd behaviour',
      'Earlier recognition of emerging risks',
      'Knowledge that supports crime and antisocial behaviour prevention',
    ],
    seo: {
      title: 'Behavioural Analysis Training for Events (Level 2)',
      description:
        'Level 2 Award in Behavioural Analysis of Events, Individual and Crowds (RQF). Understand crowd behaviour and recognise risks at public events.',
    },
  },
  {
    key: 'public_events',
    slug: 'public-events-security',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Training for securing and monitoring public events, from festivals and concerts to sporting fixtures and community gatherings.',
    whatIs: [
      'Public events concentrate large numbers of people into temporary spaces, often with temporary infrastructure and temporary staff. Keeping them safe depends on planning done in advance and monitoring carried out consistently on the day.',
      'This qualification covers how events are secured and monitored, the roles involved, and what to do when something disrupts the plan.',
    ],
    whoFor: [
      'Event and festival security staff',
      'Stewards and crowd safety teams',
      'Security officers moving into event work',
      'Event organisers and safety coordinators',
      'Venue teams running public events',
    ],
    covered: [
      'Planning and preparing to secure an event',
      'Roles and responsibilities of event security staff',
      'Monitoring crowds and event spaces',
      'Access control, searching and entry points',
      'Communication and incident reporting',
      'Emergency procedures and evacuation',
      'Counter-terrorism awareness in crowded places',
    ],
    outcomes: [
      'A recognised Level 2 public events qualification',
      'Practical knowledge of securing and monitoring events',
      'Confidence working large crowds safely',
      'A stronger profile for event and festival work',
    ],
    seo: {
      title: 'Securing and Monitoring Public Events Training (Level 2)',
      description:
        'Level 2 Award in Securing and Monitoring Public Events (RQF). Event security training for festivals, concerts, sport and public gatherings.',
    },
  },
  {
    key: 'venue_security',
    slug: 'venue-security',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Training in venue security operations, covering how fixed venues are kept secure day to day and during events.',
    whatIs: [
      'A venue has to work as a secure environment and a welcoming one at the same time. That balance is managed through access control, patrolling, surveillance and staff who know the building and its procedures properly.',
      'This qualification covers how venue security operations are run, from routine security through to handling incidents and supporting emergency procedures.',
    ],
    whoFor: [
      'Security staff at stadiums, arenas and theatres',
      'Venue and facilities teams',
      'Door supervisors moving into venue roles',
      'Event staff working fixed venues',
      'Supervisors overseeing venue security teams',
    ],
    covered: [
      'Venue security operations and procedures',
      'Access control and managing entry points',
      'Patrolling and monitoring a venue',
      'Searching people and bags',
      'Incident response and reporting',
      'Emergency procedures and evacuation',
      'Working with other venue teams and services',
    ],
    outcomes: [
      'A recognised Level 2 venue security qualification',
      'Practical knowledge of running venue security',
      'Confidence managing access and incidents',
      'A stronger profile for stadium, arena and theatre work',
    ],
    seo: {
      title: 'Venue Security Operations Training (Level 2)',
      description:
        'Level 2 Award in Venue Security Operations (RQF). Training for security staff working stadiums, arenas, theatres and other fixed venues.',
    },
  },
  {
    key: 'security_safety_incidents',
    slug: 'security-safety-incidents',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Training in responding to security and safety incidents, covering what to do when something goes wrong and how to report it properly.',
    whatIs: [
      'Incidents are rare enough that people are rusty when one happens and serious enough that a poor response has consequences. Confident handling comes from knowing the procedure in advance and having thought through your own role in it.',
      'This qualification covers how security and safety incidents are recognised, responded to and recorded, including the handover to emergency services when matters escalate.',
    ],
    whoFor: [
      'Security officers and door supervisors',
      'Venue, event and facilities staff',
      'Retail and hospitality teams',
      'Anyone with incident response duties at work',
      'Employers strengthening frontline incident handling',
    ],
    covered: [
      'Types of security and safety incident',
      'Recognising and assessing an unfolding incident',
      'Responding safely and proportionately',
      'Emergency procedures and evacuation',
      'Preserving a scene and protecting evidence',
      'Working with emergency services',
      'Reporting, recording and post-incident procedure',
    ],
    outcomes: [
      'A recognised Level 2 incident response qualification',
      'A clear procedure to follow when an incident happens',
      'Confidence acting decisively under pressure',
      'Better quality incident reporting and records',
    ],
    seo: {
      title: 'Responding to Security and Safety Incidents Training (Level 2)',
      description:
        'Level 2 Award in Responding to Security and Safety Incidents (RQF). Incident response training for security, venue and frontline staff.',
    },
  },
  {
    key: 'customer_service',
    slug: 'customer-service',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Training in the principles of customer service, for security and frontline staff who represent an organisation as well as protecting it.',
    whatIs: [
      'On most sites the security team is the first person a visitor speaks to and the last one they see. That makes customer service part of the job rather than a distraction from it, and clients increasingly buy on exactly that basis.',
      'This qualification covers the principles of good customer service and how to apply them in roles where you are balancing helpfulness with a security responsibility.',
    ],
    whoFor: [
      'Security officers on corporate and reception sites',
      'Door supervisors and venue staff',
      'Concierge and front of house teams',
      'Retail and hospitality workers',
      'Employers raising service standards across a team',
    ],
    covered: [
      'Principles of good customer service',
      'Understanding customer needs and expectations',
      'Communication and interpersonal skills',
      'Handling complaints and difficult conversations',
      'Working as part of a team',
      'Representing your organisation professionally',
    ],
    outcomes: [
      'A recognised Level 2 customer service qualification',
      'Stronger communication and service skills',
      'A better fit for corporate and front of house contracts',
      'A more rounded professional profile',
    ],
    seo: {
      title: 'Principles of Customer Service Training (Level 2)',
      description:
        'Level 2 Award in Principles of Customer Service (RQF). Customer service training for security, front of house and frontline staff.',
    },
  },
  {
    key: 'personal_licence_holder',
    slug: 'personal-licence-holder',
    level: 'Level 2 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The qualification for applying for a personal licence to sell alcohol, covering licensing law and the responsibilities that come with it.',
    whatIs: [
      'Anyone authorising the sale of alcohol at licensed premises needs a personal licence, and this qualification is the training step behind applying for one. It is a licensing qualification rather than an SIA one, and it sits naturally alongside door supervision for people working in the licensed trade.',
      'The course covers the law governing licensed premises and the duties a personal licence holder takes on, including the parts most likely to land a venue in trouble: underage sales, drunkenness and the conditions attached to a premises licence.',
    ],
    whoFor: [
      'Anyone applying for a personal licence',
      'Pub, bar and restaurant managers',
      'Designated premises supervisors',
      'Retail staff responsible for alcohol sales',
      'Door supervisors moving into venue management',
    ],
    covered: [
      'Licensing law and the licensing objectives',
      'The role and duties of a personal licence holder',
      'Premises licences and their conditions',
      'Designated premises supervisors',
      'Protecting children from harm and preventing underage sales',
      'Dealing with drunkenness and disorder',
      'Licensing authorities, police powers and enforcement',
    ],
    outcomes: [
      'A recognised Level 2 personal licence qualification',
      'The training step behind a personal licence application',
      'A working knowledge of licensing law',
      'Confidence meeting your duties as a licence holder',
    ],
    seo: {
      title: 'Personal Licence Holder Training (Level 2)',
      description:
        'Level 2 Award for Personal Licence Holders (RQF). The qualification behind a personal licence application for selling alcohol.',
    },
  },

  // ── Trainer and instructor qualifications ───────────────────
  {
    key: 'education_training',
    slug: 'education-and-training',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The standard entry qualification for teaching and training adults, and the usual starting point for anyone moving from practitioner to instructor.',
    whatIs: [
      'Knowing a subject and being able to teach it are different skills. This qualification covers the second one: how adults learn, how to plan and deliver a session that works, and how to assess whether anything actually landed.',
      'It is widely recognised as the entry qualification for teaching and training roles, and it is normally the first step for experienced security professionals who want to deliver training themselves.',
    ],
    whoFor: [
      'Security professionals moving into training roles',
      'Anyone starting out in teaching or instructing adults',
      'Subject experts who need a recognised teaching qualification',
      'In-house trainers delivering workplace training',
      'Those working towards specialist trainer qualifications',
    ],
    covered: [
      'Roles and responsibilities of a teacher or trainer',
      'How adults learn and what helps them',
      'Planning and preparing inclusive sessions',
      'Delivery methods and managing a group',
      'Assessment and giving constructive feedback',
      'Creating a safe and inclusive learning environment',
      'Delivering a microteach session',
    ],
    outcomes: [
      'A recognised Level 3 teaching and training qualification',
      'The ability to plan, deliver and assess a session',
      'A route into instructing and training work',
      'The usual prerequisite for specialist trainer awards',
    ],
    seo: {
      title: 'Level 3 Award in Education and Training (AET)',
      description:
        'Level 3 Award in Education and Training (RQF). The standard entry qualification for teaching and training adults, and the first step into instructing.',
    },
  },
  {
    key: 'pi_trainer',
    slug: 'physical-intervention-trainer',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The trainer qualification for delivering physical intervention training within the private security industry.',
    whatIs: [
      'Physical intervention is the part of security training where poor instruction does real harm. Delivering it safely means understanding not just the techniques but the medical risks, the legal framework and how to run a practical session where nobody gets injured learning.',
      'This qualification prepares experienced practitioners to deliver physical intervention training to security staff, covering both the instructional skills and the responsibilities that come with teaching hands-on techniques.',
    ],
    whoFor: [
      'Experienced security professionals moving into training',
      'Existing trainers adding physical intervention to their delivery',
      'In-house trainers at security companies',
      'Instructors delivering licence-linked qualifications',
    ],
    covered: [
      'The role and responsibilities of a physical intervention trainer',
      'The legal framework around use of force',
      'Medical implications and positional asphyxia awareness',
      'Risk assessing a practical training environment',
      'Teaching disengagement and restraint techniques safely',
      'Assessing learners on practical skills',
      'Delivering and reviewing a practical session',
    ],
    outcomes: [
      'A recognised Level 3 physical intervention trainer qualification',
      'The ability to deliver PI training to security staff',
      'A thorough grounding in safe practical delivery',
      'A route into training work within the industry',
    ],
    seo: {
      title: 'Physical Intervention Trainer Course (Level 3)',
      description:
        'Level 3 Award for Deliverers of Physical Intervention Training in the Private Security Industry (RQF). Train to deliver PI training to security staff.',
    },
  },
  {
    key: 'cp_pi_trainer',
    slug: 'close-protection-pi-trainer',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The trainer qualification for delivering physical intervention training specifically to close protection operatives.',
    whatIs: [
      'Physical intervention in close protection is a different problem from physical intervention on a door. The operative is protecting a principal rather than controlling a subject, often while moving, often as part of a team, and the techniques and priorities reflect that.',
      'This qualification prepares trainers to deliver physical intervention training built around close protection work, covering the instructional skills alongside the specific demands of protective operations.',
    ],
    whoFor: [
      'Experienced close protection operatives moving into training',
      'Physical intervention trainers specialising in CP',
      'In-house trainers at close protection providers',
      'Instructors delivering CP qualifications',
    ],
    covered: [
      'The role and responsibilities of a CP physical intervention trainer',
      'The legal framework around use of force',
      'Medical implications and risk awareness',
      'Protective techniques in a close protection context',
      'Team-based intervention and extraction',
      'Risk assessing a practical training environment',
      'Assessing learners and delivering a practical session',
    ],
    outcomes: [
      'A recognised Level 3 CP physical intervention trainer qualification',
      'The ability to deliver PI training to close protection operatives',
      'Instructional skills matched to protective work',
      'A specialist route into training within the CP sector',
    ],
    seo: {
      title: 'Close Protection Physical Intervention Trainer Course (Level 3)',
      description:
        'Level 3 Award for Deliverers of Physical Intervention Training for Close Protection Operatives (RQF). Train to deliver PI training to CPOs.',
    },
  },
  {
    key: 'conflict_trainer',
    slug: 'conflict-management-trainer',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The trainer qualification for delivering conflict management training to others.',
    whatIs: [
      'Conflict management training only works if the person delivering it can run realistic scenarios, draw out a group and handle the discomfort that comes with rehearsing confrontation. That is a teaching skill as much as a subject one.',
      'This qualification prepares trainers to deliver conflict management training, covering the underpinning models alongside how to plan, deliver and assess sessions that change how people actually behave under pressure.',
    ],
    whoFor: [
      'Security professionals moving into training roles',
      'Existing trainers adding conflict management to their delivery',
      'In-house trainers in security, retail, transport or healthcare',
      'Instructors delivering licence-linked qualifications',
    ],
    covered: [
      'The role and responsibilities of a conflict management trainer',
      'Conflict management models and theory',
      'Planning and preparing conflict management sessions',
      'Running realistic scenario-based training',
      'Managing group dynamics and sensitive content',
      'Assessing learners and giving feedback',
      'Delivering and reviewing a training session',
    ],
    outcomes: [
      'A recognised Level 3 conflict management trainer qualification',
      'The ability to deliver conflict management training',
      'Scenario design and facilitation skills',
      'A route into training work across several sectors',
    ],
    seo: {
      title: 'Conflict Management Trainer Course (Level 3)',
      description:
        'Level 3 Award in the Delivery of Conflict Management Training (RQF). Train to deliver conflict management training to security and frontline staff.',
    },
  },

  // ── First aid ───────────────────────────────────────────────
  {
    key: 'emergency_first_aid',
    slug: 'emergency-first-aid-at-work',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'Emergency first aid training for the workplace, covering the life-threatening situations a first aider is most likely to face.',
    whatIs: [
      'Emergency first aid at work concentrates on the situations where minutes matter: someone unresponsive, not breathing, choking, bleeding heavily or in shock. The aim is a first aider who acts immediately and correctly rather than waiting for someone else.',
      'This qualification is widely used to meet workplace first aid provision and is a common requirement for security, event and venue staff.',
    ],
    whoFor: [
      'Workplace first aiders',
      'Security, door and event staff',
      'Venue and facilities teams',
      'Employers meeting first aid provision duties',
      'Anyone wanting practical emergency first aid skills',
    ],
    covered: [
      'The role and responsibilities of a first aider',
      'Assessing an incident scene safely',
      'Treating an unresponsive casualty',
      'Cardiopulmonary resuscitation (CPR)',
      'Choking',
      'Severe bleeding, wounds and shock',
      'Seizures, burns and minor injuries',
      'Recording and reporting incidents',
    ],
    outcomes: [
      'A recognised Level 3 emergency first aid qualification',
      'The confidence to act in a life-threatening emergency',
      'Practical CPR and casualty care skills',
      'A qualification many security and event roles expect',
    ],
    seo: {
      title: 'Emergency First Aid at Work Training (Level 3, EFAW)',
      description:
        'Level 3 Award in Emergency First Aid at Work (RQF). Practical emergency first aid training for workplace first aiders and security staff.',
    },
  },
  {
    key: 'first_aid_at_work',
    slug: 'first-aid-at-work',
    level: 'Level 3 Award',
    heroImage: '/images/LDN.png',
    summary:
      'The fuller workplace first aid qualification, covering a wider range of injuries and illnesses than the emergency award.',
    whatIs: [
      'First Aid at Work goes beyond the immediate life-threatening emergencies to cover the broader range of injuries and medical conditions a workplace first aider may have to deal with, from fractures and head injuries to conditions such as asthma, diabetes and anaphylaxis.',
      'It is the qualification usually chosen where a workplace first aid needs assessment calls for more than emergency-level cover.',
    ],
    whoFor: [
      'Designated workplace first aiders',
      'Employers whose needs assessment requires fuller cover',
      'Security, venue and event teams',
      'Higher risk workplaces and sites',
      'Anyone wanting comprehensive first aid training',
    ],
    covered: [
      'The role and responsibilities of a first aider',
      'Assessing an incident and prioritising casualties',
      'Unresponsive casualties and CPR',
      'Choking, severe bleeding and shock',
      'Fractures, dislocations and spinal injuries',
      'Head, chest, eye and abdominal injuries',
      'Medical conditions including asthma, diabetes and anaphylaxis',
      'Burns, poisoning and recording incidents',
    ],
    outcomes: [
      'A recognised Level 3 first aid at work qualification',
      'Skills across a wide range of injuries and conditions',
      'The confidence to act as a designated workplace first aider',
      'Fuller cover than the emergency first aid award provides',
    ],
    seo: {
      title: 'First Aid at Work Training (Level 3, FAW)',
      description:
        'Level 3 Award in First Aid at Work (RQF). The fuller workplace first aid qualification, covering a wide range of injuries and medical conditions.',
    },
  },
  {
    key: 'basic_life_support',
    slug: 'basic-life-support',
    level: 'Level 2',
    heroImage: '/images/LDN.png',
    summary:
      'Basic life support training for adults and children, focused on keeping someone alive until help arrives.',
    whatIs: [
      'Basic life support is the core of emergency care: recognising that someone has stopped breathing, starting effective chest compressions, and using a defibrillator without hesitating. Survival rates depend heavily on how quickly a bystander acts.',
      'This qualification covers life support for both adults and children, including the differences in technique that matter when the casualty is small.',
    ],
    whoFor: [
      'Security, venue and event staff',
      'Workplace first aiders wanting focused CPR training',
      'Staff working with children and families',
      'Teams with defibrillators on site',
      'Anyone wanting the core life-saving skills',
    ],
    covered: [
      'Assessing an emergency scene safely',
      'Recognising an unresponsive casualty',
      'The recovery position',
      'Cardiopulmonary resuscitation for adults',
      'Cardiopulmonary resuscitation for children',
      'Using an automated external defibrillator (AED)',
      'Choking in adults and children',
    ],
    outcomes: [
      'A recognised Level 2 basic life support qualification',
      'Effective CPR technique for adults and children',
      'Confidence using a defibrillator',
      'The skills that make the biggest difference before help arrives',
    ],
    seo: {
      title: 'Basic Life Support Training, Adults and Children (Level 2)',
      description:
        'Level 2 in Basic Life Support (Adults and Children) (RQF). CPR, defibrillator and choking training for adults and children.',
    },
  },
];

const BY_SLUG = new Map(COURSE_OVERVIEWS.map((c) => [c.slug, c]));
const BY_KEY = new Map(COURSE_OVERVIEWS.map((c) => [c.key, c]));

export function getCourseOverviewBySlug(slug: string): CourseOverview | undefined {
  return BY_SLUG.get(slug);
}

export function getCourseOverviewByKey(key: string): CourseOverview | undefined {
  return BY_KEY.get(key);
}
