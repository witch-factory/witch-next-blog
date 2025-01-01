import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const container = style({
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem',
});

export const title = style({
  'fontSize': '1.25rem',
  'marginTop': '0.5rem',
  'marginBottom': '0.5rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
  },
});

export const separator = style({
  height: '1px',
  width: '100%',
  backgroundColor: themeColor.headerBorderColor,
  margin: '1rem 0',
  border: 'none',
});
