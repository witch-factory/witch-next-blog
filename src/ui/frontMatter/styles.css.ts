import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const time = style({
  display: 'block',
  fontSize: '1.25rem',
  fontWeight: 400,
});

export const title = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '1rem'
});

export const tagList = style({
  listStyle: 'none',
  margin: 0,
  marginTop: '1rem',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  gap: '0.75rem'
});

export const tag = style({
  backgroundColor:themeColor.accentBgColor,
  color: themeColor.accentTextColor,
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem'
});