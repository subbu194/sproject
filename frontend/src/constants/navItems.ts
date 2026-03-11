export interface NavItem {
  label: string;
  path: string;
  sectionId: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Story', path: '/page/story', sectionId: 'story' },
  { label: 'Daily Log', path: '/page/daily-log', sectionId: 'daily-log' },
  { label: 'Thoughts', path: '/page/thoughts', sectionId: 'thoughts' },
  { label: 'Press', path: '/page/press', sectionId: 'press' },
  { label: 'Achievements', path: '/page/achievements', sectionId: 'achievements' },
  { label: 'Connect', path: '/page/connect', sectionId: 'connect' },
];
