import { style } from '@vanilla-extract/css';

export const tag = style({
  backgroundColor: 'var(--accentBgColor)',
  color: 'var(--accentTextColor)',
  borderRadius: '0.25rem',
  fontSize: '0.8rem',
  padding: '0.25rem 0.5rem',
});

export const tagList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  gap: '0.5rem',
});