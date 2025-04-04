import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const titieLg = style({
  'fontSize': '1.5rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '2rem',
      fontWeight: 700,
    },
  },
});

export const titleMd = style({
  'fontSize': '1.25rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
  },
});

export const link = style({
  display: 'block',
  color: themeColor.infoTextColor,
  margin: '1.25rem 0',
});
