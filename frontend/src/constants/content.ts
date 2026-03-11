/** Static UI labels and strings only — NO data arrays */

export const SITE_NAME = 'Salman Shariff';
export const SITE_TAGLINE = 'Be Believers, Be Leaders';

export const HERO_BADGE = 'Social Entrepreneur · Philanthropist · Humanitarian';
export const HERO_DESCRIPTION =
  "I'm Salman Shariff — driven by a mission to create impact through entrepreneurship, philanthropy, and community building.";

export const PRIMARY_CTA_LABEL = 'Know More';
export const PRIMARY_CTA_LINK = '/page/story';
export const SECONDARY_CTA_LABEL = "Today's Update";
export const SECONDARY_CTA_LINK = '/page/daily-log';

export const SECTION_LABELS = {
  story: 'My Story',
  ventures: 'Ventures & Projects',
  dailyLog: 'Daily Log',
  thoughts: 'Thoughts & Insights',
  press: 'Press & Media',
  achievements: 'Achievements',
  connect: 'Connect',
} as const;

export const EMPTY_STATE_MESSAGES = {
  story: 'Timeline coming soon.',
  ventures: 'No ventures listed yet.',
  dailyLog: 'No log entries yet.',
  thoughts: 'No thoughts published yet.',
  press: 'No press mentions yet.',
  achievements: 'No achievements listed yet.',
  connect: 'Contact information coming soon.',
  contacts: 'No submissions yet.',
} as const;

export const FOOTER_TEXT = `© ${new Date().getFullYear()} Salman Shariff. All rights reserved.`;
