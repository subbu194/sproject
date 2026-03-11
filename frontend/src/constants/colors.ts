export const COLORS = {
  cream: '#F5F0E8',
  warmWhite: '#FDFAF5',
  brown: '#2C1A0E',
  brownLight: '#5C3D2E',
  gold: '#C8962A',
  goldLight: '#E8B84B',
  muted: '#8C7B6E',
  cardBg: '#FDF6EC',
} as const;

export type ColorKey = keyof typeof COLORS;
