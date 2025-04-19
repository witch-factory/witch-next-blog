import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const footer = style({
  backgroundColor: themeColor.contentBgColor,
  color: themeColor.infoTextColor,
  marginTop: '3.125rem',
  padding: '2rem 0',
});

export const container = style({
  maxWidth: '60rem',
  margin: '0 auto',
});

export const inner = style({
  width: '92%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem',

  gap: '0.75rem',
});

export const title = style({
  'fontSize': '1.25rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
  },
});

export const paragraph = style({
  margin: 0,
});
