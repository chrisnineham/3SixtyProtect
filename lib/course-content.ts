import type { CourseType } from './types';

export interface CoursePageContent {
  type: CourseType;
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
  };
  level: string;
  durationLabel: string;
  whatIs: { heading: string; paragraphs: string[] };
  whoFor: { heading: string; intro: string; items: string[] };
  whatGain: { heading: string; intro: string; items: string[] };
  areasCovered: { heading: string; intro: string; items: string[] };
  standards?: { heading: string; intro: string; items: string[] };
  careers: { heading: string; intro: string; items: string[] };
  duration: { heading: string; summary: string; points: string[] };
  entryRequirements: { heading: string; intro: string; items: string[] };
  assessment: { heading: string; intro: string; items: string[] };
  seo: { title: string; description: string };
}

export const DOOR_SUPERVISION_CONTENT: CoursePageContent = {
  type: 'door_supervision',
  level: 'SIA Level 2 Award',
  durationLabel: 'Typically 6 days',
  hero: {
    eyebrow: 'SIA Door Supervision Training',
    title: 'Become a qualified',
    highlight: 'SIA Door Supervisor',
    description:
      'The fastest, most accessible route into the private security industry. Get the licence-linked qualification you need to work the door at pubs, clubs, events and licensed venues.',
  },
  whatIs: {
    heading: 'What is Door Supervision?',
    paragraphs: [
      'Door Supervisors are the front line of safety and security at licensed premises — from bars, clubs and pubs to concerts, festivals and private events. The role goes far beyond standing on a door: it’s about managing access, defusing conflict, keeping people safe and acting professionally under pressure.',
      'To work as a Door Supervisor in the UK you need a valid SIA Door Supervisor licence, and to apply for that licence you must first complete an approved Level 2 Door Supervision qualification. Our course delivers exactly that — combining the law, communication skills and practical techniques you’ll use every shift.',
    ],
  },
  whoFor: {
    heading: 'Who is this course for?',
    intro:
      'This course is ideal for anyone looking to start a career in security, with no prior experience required.',
    items: [
      'People wanting to enter the private security industry',
      'Anyone seeking flexible, well-paid work in events and nightlife',
      'Those looking for a stepping-stone toward Close Protection',
      'Career-changers wanting a recognised, transferable qualification',
      'Venue and event staff who need a formal door qualification',
    ],
  },
  whatGain: {
    heading: 'What you’ll gain',
    intro:
      'By the end of the course you’ll have the knowledge, practical skills and qualification to apply for your SIA licence with confidence.',
    items: [
      'A recognised Level 2 Door Supervision qualification',
      'Eligibility to apply for your SIA Door Supervisor licence',
      'Practical conflict management and de-escalation skills',
      'Safe, lawful physical intervention techniques',
      'Confidence handling real-world situations on the door',
      'Emergency first aid awareness',
    ],
  },
  areasCovered: {
    heading: 'What’s covered in training',
    intro:
      'Your training blends classroom learning with hands-on practical sessions across the core units.',
    items: [
      'Working in the private security industry',
      'Roles and responsibilities of a Door Supervisor',
      'Civil and criminal law relevant to the role',
      'Conflict management and communication skills',
      'Physical intervention skills and safe restraint',
      'Searching, ejections and incident handling',
      'Drugs awareness and licensing law',
      'Emergency first aid and incident response',
      'Counter-terrorism awareness',
    ],
  },
  careers: {
    heading: 'Where it can take you',
    intro:
      'A Door Supervisor licence opens the door to varied, flexible and well-paid work — and to further qualifications.',
    items: [
      'Door Supervisor at bars, clubs and licensed venues',
      'Event and festival security',
      'Retail and corporate security roles',
      'Stadium and concert security',
      'A foundation for progressing to Close Protection',
    ],
  },
  duration: {
    heading: 'Course duration',
    summary:
      'The course typically runs over 6 days, delivered as full days of classroom and practical training.',
    points: [
      'Around 6 days of guided training',
      'Daytime delivery, usually 09:00–17:00',
      'A mix of theory, practical sessions and assessment',
      'Flexible intakes scheduled throughout the year',
    ],
  },
  entryRequirements: {
    heading: 'Entry requirements',
    intro: 'To enrol on the course you’ll need to meet a few simple requirements.',
    items: [
      'Be 18 years of age or older',
      'A reasonable standard of spoken and written English',
      'Valid photo ID (for the qualification and licence application)',
      'No formal prior qualifications or experience required',
    ],
  },
  assessment: {
    heading: 'How you’re assessed',
    intro:
      'Assessment is straightforward and fully supported by your trainers throughout the course.',
    items: [
      'Multiple-choice examinations for the knowledge units',
      'A practical physical intervention assessment',
      'Practical conflict management scenarios',
      'Full guidance and support to prepare for each assessment',
    ],
  },
  seo: {
    title: 'SIA Door Supervision Training — Door Supervisor Course',
    description:
      'Get qualified with our SIA Door Supervision training. The Level 2 Door Supervisor course covers conflict management, physical intervention and the law — your route to an SIA licence.',
  },
};

export const CLOSE_PROTECTION_CONTENT: CoursePageContent = {
  type: 'close_protection',
  level: 'SIA Level 3 Award',
  durationLabel: 'Typically 14–15 days',
  hero: {
    eyebrow: 'SIA Close Protection Training',
    title: 'Train for a career in',
    highlight: 'Close Protection',
    description:
      'Our advanced Close Protection programme prepares you for one of the most respected and rewarding roles in private security — protecting people to the highest professional standard.',
  },
  whatIs: {
    heading: 'What is Close Protection?',
    paragraphs: [
      'Close Protection is the discipline of protecting individuals — often public figures, executives, dignitaries or high-net-worth clients — from risks to their safety. A Close Protection Officer (CPO) plans ahead, assesses threats, controls environments and is ready to act decisively when it matters.',
      'It’s a profession built on judgement, discretion and meticulous preparation as much as physical capability. To work as a CPO in the UK you need a valid SIA Close Protection licence, which requires an approved Level 3 Close Protection qualification — exactly what this course provides.',
    ],
  },
  whoFor: {
    heading: 'Who is this course for?',
    intro:
      'This course suits motivated individuals ready to commit to a demanding, high-standard profession.',
    items: [
      'Door Supervisors looking to progress their career',
      'Ex-military and ex-police personnel transitioning to the private sector',
      'Security professionals moving into protective roles',
      'Driven individuals seeking a premium career in protection',
      'Those wanting to work in the UK or internationally',
    ],
  },
  whatGain: {
    heading: 'What you’ll gain',
    intro:
      'You’ll leave with the qualification, operational skillset and professional mindset expected of a modern CPO.',
    items: [
      'A recognised Level 3 Close Protection qualification',
      'Eligibility to apply for your SIA Close Protection licence',
      'Operational planning and threat assessment skills',
      'Foot and vehicle drills and team coordination',
      'Surveillance awareness and reconnaissance ability',
      'The professional standards and conduct clients expect',
    ],
  },
  areasCovered: {
    heading: 'Key areas covered',
    intro:
      'The programme is intensive and practical, combining classroom learning with realistic operational exercises.',
    items: [
      'Roles and responsibilities of a CP operative',
      'Threat and risk assessment',
      'Operational planning and briefings',
      'Foot drills and formation work',
      'Vehicle drills, embus and debus procedures',
      'Route selection and reconnaissance',
      'Surveillance and counter-surveillance awareness',
      'Search procedures and venue security',
      'Conflict management and incident response',
      'Relevant law and professional conduct',
    ],
  },
  standards: {
    heading: 'Professional standards expected',
    intro:
      'Close Protection is a profession of discipline and discretion. Throughout the course we hold you to the standards the industry demands.',
    items: [
      'Discretion, integrity and sound judgement at all times',
      'A professional appearance and conduct',
      'Reliability, punctuality and attention to detail',
      'Calmness and clear decision-making under pressure',
      'Teamwork and clear communication',
      'A commitment to continuous professional development',
    ],
  },
  careers: {
    heading: 'Career opportunities',
    intro:
      'A Close Protection licence is a passport to varied, high-earning and international work.',
    items: [
      'Close Protection Officer for private clients',
      'Corporate and executive protection',
      'Celebrity, media and public-figure protection',
      'Residential security teams',
      'International and maritime protection roles',
    ],
  },
  duration: {
    heading: 'Course duration',
    summary:
      'The course typically runs over 14–15 days of intensive, full-day training and assessment.',
    points: [
      'Around 14–15 days of guided training',
      'Full operational days with practical exercises',
      'A blend of classroom theory and live scenarios',
      'Scheduled intakes across the year',
    ],
  },
  entryRequirements: {
    heading: 'Entry requirements',
    intro:
      'Close Protection is an advanced course, so a few additional requirements apply.',
    items: [
      'Be 18 years of age or older',
      'A good standard of spoken and written English',
      'Valid photo ID for the qualification and licence application',
      'A valid emergency first aid certificate is recommended',
      'A reasonable level of physical fitness',
    ],
  },
  assessment: {
    heading: 'How you’re assessed',
    intro:
      'You’ll be assessed across both knowledge and practical competence, with full support throughout.',
    items: [
      'Written and multiple-choice examinations',
      'Practical operational assessments and scenarios',
      'Assessed planning and team exercises',
      'Continuous trainer feedback and support',
    ],
  },
  seo: {
    title: 'SIA Close Protection Training — Close Protection Course',
    description:
      'Train as a Close Protection Officer with our SIA Level 3 Close Protection course. Covering threat assessment, foot and vehicle drills and professional standards — your route to a CP licence.',
  },
};

export const COURSE_CONTENT: Record<CourseType, CoursePageContent> = {
  door_supervision: DOOR_SUPERVISION_CONTENT,
  close_protection: CLOSE_PROTECTION_CONTENT,
};
