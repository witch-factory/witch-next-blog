import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const footer = style({
  backgroundColor: themeColor.contentBgColor,
  color: themeColor.infoTextColor,
  marginTop: '3.125rem',
  padding: '1.25rem 0',
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
});
