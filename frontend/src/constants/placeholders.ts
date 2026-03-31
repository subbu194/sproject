function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makePlaceholder(
  gradientId: string,
  from: string,
  to: string,
  icon: string,
  label: string
): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">` +
      `<defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs>` +
      `<rect width="600" height="400" fill="url(#${gradientId})"/>` +
      `<text x="300" y="190" text-anchor="middle" font-size="48" fill="white" opacity="0.9">${icon}</text>` +
      `<text x="300" y="240" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="bold" fill="white" opacity="0.85">${label}</text>` +
    `</svg>`
  );
}

const GRADIENTS = [
  { id: 'g1', from: '#2C1A0E', to: '#C8962A' },
  { id: 'g2', from: '#1a3a2a', to: '#4ade80' },
  { id: 'g3', from: '#1e293b', to: '#60a5fa' },
  { id: 'g4', from: '#3b1764', to: '#c084fc' },
  { id: 'g5', from: '#7c2d12', to: '#fb923c' },
  { id: 'g6', from: '#0c4a6e', to: '#22d3ee' },
  { id: 'g7', from: '#4a1d3a', to: '#f472b6' },
  { id: 'g8', from: '#1a2e1a', to: '#a3e635' },
  { id: 'g9', from: '#3b2f1e', to: '#fbbf24' },
  { id: 'g10', from: '#1e1b4b', to: '#818cf8' },
];

export const STORY_IMAGES = [
  makePlaceholder('s1', GRADIENTS[0].from, GRADIENTS[0].to, '\u{1F4D6}', 'The Beginning'),
  makePlaceholder('s2', GRADIENTS[1].from, GRADIENTS[1].to, '\u{1F331}', 'Growth Phase'),
  makePlaceholder('s3', GRADIENTS[2].from, GRADIENTS[2].to, '\u{2B50}', 'New Horizons'),
  makePlaceholder('s4', GRADIENTS[3].from, GRADIENTS[3].to, '\u{1F680}', 'Taking Flight'),
  makePlaceholder('s5', GRADIENTS[4].from, GRADIENTS[4].to, '\u{1F3AF}', 'Mission Driven'),
];

export const LOG_IMAGES = [
  makePlaceholder('l1', GRADIENTS[5].from, GRADIENTS[5].to, '\u{1F4CB}', 'Daily Update'),
  makePlaceholder('l2', GRADIENTS[6].from, GRADIENTS[6].to, '\u{1F4BC}', 'Work Progress'),
  makePlaceholder('l3', GRADIENTS[7].from, GRADIENTS[7].to, '\u{1F91D}', 'Collaboration'),
  makePlaceholder('l4', GRADIENTS[8].from, GRADIENTS[8].to, '\u{1F4CA}', 'Milestones'),
  makePlaceholder('l5', GRADIENTS[9].from, GRADIENTS[9].to, '\u{1F525}', 'Highlights'),
];

export const THOUGHT_IMAGES = [
  makePlaceholder('t1', GRADIENTS[3].from, GRADIENTS[3].to, '\u{1F4A1}', 'Insight'),
  makePlaceholder('t2', GRADIENTS[4].from, GRADIENTS[4].to, '\u{1F9E0}', 'Innovation'),
  makePlaceholder('t3', GRADIENTS[0].from, GRADIENTS[0].to, '\u{1F30D}', 'Perspective'),
  makePlaceholder('t4', GRADIENTS[1].from, GRADIENTS[1].to, '\u{1F4AC}', 'Reflection'),
  makePlaceholder('t5', GRADIENTS[2].from, GRADIENTS[2].to, '\u{2728}', 'Vision'),
];

export const PRESS_IMAGES = [
  makePlaceholder('p1', GRADIENTS[8].from, GRADIENTS[8].to, '\u{1F4F0}', 'Featured'),
  makePlaceholder('p2', GRADIENTS[5].from, GRADIENTS[5].to, '\u{1F3A5}', 'Interview'),
  makePlaceholder('p3', GRADIENTS[6].from, GRADIENTS[6].to, '\u{1F50A}', 'Coverage'),
  makePlaceholder('p4', GRADIENTS[9].from, GRADIENTS[9].to, '\u{1F3E2}', 'Profile'),
  makePlaceholder('p5', GRADIENTS[7].from, GRADIENTS[7].to, '\u{1F3C6}', 'Recognition'),
];

export const ACHIEVEMENT_IMAGES = [
  makePlaceholder('a1', GRADIENTS[0].from, GRADIENTS[0].to, '\u{1F3C6}', 'Award'),
  makePlaceholder('a2', GRADIENTS[4].from, GRADIENTS[4].to, '\u{1F3AF}', 'Goal Reached'),
  makePlaceholder('a3', GRADIENTS[2].from, GRADIENTS[2].to, '\u{1F4AA}', 'Strength'),
  makePlaceholder('a4', GRADIENTS[3].from, GRADIENTS[3].to, '\u{2B50}', 'Excellence'),
  makePlaceholder('a5', GRADIENTS[1].from, GRADIENTS[1].to, '\u{1F31F}', 'Shining'),
];

export const DEMO_STORY = [
  { _id: 'demo-s1', year: '2018', title: 'The Spark of Purpose', description: 'A journey began with a simple belief — that entrepreneurship and compassion can change lives. The seeds of impact were planted early.', images: [STORY_IMAGES[0]] },
  { _id: 'demo-s2', year: '2020', title: 'Building Foundations', description: 'Launched the first community initiative focused on education and empowerment, touching over 500 families in the first year.', images: [STORY_IMAGES[1]] },
  { _id: 'demo-s3', year: '2022', title: 'Scaling Impact', description: 'Expanded programs across multiple cities, forming partnerships with NGOs and corporate sponsors to amplify reach.', images: [STORY_IMAGES[2]] },
  { _id: 'demo-s4', year: '2024', title: 'A Movement Takes Shape', description: 'What started as a vision became a movement — inspiring a new generation of believers and leaders across the nation.', images: [STORY_IMAGES[3]] },
];

export const DEMO_LOGS = [
  { _id: 'demo-l1', date: '2026-03-28', title: 'Morning Strategy Session', body: 'Reviewed quarterly goals with the leadership team. Key focus areas: youth mentorship expansion and sustainable funding models.', tags: ['Strategy', 'Leadership'], images: [LOG_IMAGES[0]] },
  { _id: 'demo-l2', date: '2026-03-27', title: 'Community Visit — North Zone', body: 'Spent the day meeting beneficiaries of the skill development program. Heartening to see the tangible impact on ground.', tags: ['Community', 'Impact'], images: [LOG_IMAGES[1]] },
  { _id: 'demo-l3', date: '2026-03-26', title: 'Partnership Meeting with TechCorp', body: 'Discussed the CSR collaboration for digital literacy in rural schools. Exciting possibilities ahead for Phase 2 rollout.', tags: ['Partnership', 'Education'], images: [LOG_IMAGES[2]] },
];

export const DEMO_THOUGHTS = [
  { _id: 'demo-t1', topic: 'Leadership', title: 'Why Servant Leadership Wins', summary: 'True leaders serve first. When you put people before profit, loyalty and impact follow naturally — building legacies, not just businesses.', images: [THOUGHT_IMAGES[0]] },
  { _id: 'demo-t2', topic: 'Philanthropy', title: 'The Ripple Effect of Giving', summary: 'Every act of generosity creates waves far beyond what we see. One scholarship can transform a family for generations to come.', images: [THOUGHT_IMAGES[1]] },
  { _id: 'demo-t3', topic: 'Entrepreneurship', title: 'Purpose Over Profit', summary: 'The most enduring businesses are built on purpose. When your why is bigger than your wallet, success becomes a byproduct of meaning.', images: [THOUGHT_IMAGES[2]] },
];

export const DEMO_PRESS = [
  { _id: 'demo-p1', outlet: 'The Daily Chronicle', title: 'Salman Shariff: The Entrepreneur Changing Lives Through Philanthropy', year: '2025', images: [PRESS_IMAGES[0]] },
  { _id: 'demo-p2', outlet: 'Impact Magazine', title: 'Top 40 Under 40 Social Innovators to Watch', year: '2024', images: [PRESS_IMAGES[1]] },
  { _id: 'demo-p3', outlet: 'Business Herald', title: 'How Purpose-Driven Startups Are Reshaping India', year: '2024', images: [PRESS_IMAGES[2]] },
  { _id: 'demo-p4', outlet: 'Youth Voice Radio', title: 'Interview: Building a Generation of Believers and Leaders', year: '2023', images: [PRESS_IMAGES[3]] },
  { _id: 'demo-p5', outlet: 'National Herald', title: 'Community Champion Award — Recognizing Grassroots Impact', year: '2023', images: [PRESS_IMAGES[4]] },
];

export const DEMO_ACHIEVEMENTS = [
  { _id: 'demo-a1', icon: '\u{1F3C6}', title: 'Social Entrepreneur of the Year', description: 'Recognized for outstanding contributions to community development through innovative social enterprise models.', year: '2025', images: [ACHIEVEMENT_IMAGES[0]] },
  { _id: 'demo-a2', icon: '\u{1F393}', title: 'Youth Mentorship Excellence Award', description: 'Honored for mentoring over 1,000 young entrepreneurs and helping them launch purpose-driven ventures.', year: '2024', images: [ACHIEVEMENT_IMAGES[1]] },
  { _id: 'demo-a3', icon: '\u{1F30D}', title: 'Global Impact Fellowship', description: 'Selected as a fellow for the Global Impact Accelerator, representing India at the international social innovation summit.', year: '2024', images: [ACHIEVEMENT_IMAGES[2]] },
  { _id: 'demo-a4', icon: '\u{2B50}', title: 'Community Champion — Bangalore', description: 'Awarded by the city council for sustained community service and impact-driven programs across urban underserved areas.', year: '2023', images: [ACHIEVEMENT_IMAGES[3]] },
];
