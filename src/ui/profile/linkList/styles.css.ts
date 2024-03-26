import { style } from '@vanilla-extract/css';

export const linkList = style({
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  paddingLeft: 0,
  margin: 0,
  marginBottom: '0.5rem',
  gap: '0 1rem',
});

export const link = style({
  textDecoration: 'none',
  color: 'var(--lightAccentTextColor)',
});

export const linkBox = style({
  margin: 0,
});