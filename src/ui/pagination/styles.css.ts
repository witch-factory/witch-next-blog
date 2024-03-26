import { style } from '@vanilla-extract/css';

export const container = style({
  margin: '1.5rem auto',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const dotts = style({
  padding: '0.5rem 1rem',
  borderRadius: '0.25rem',
  fontWeight: 600,
});

export const item = style({
  padding: '0.5rem 1rem',
  borderRadius: '0.25rem',
  fontWeight: 600,

  ':hover': {
    background: 'var(--contentBgHover)',
  },
});

export const selected = style({
  padding: '0.5rem 1rem',
  borderRadius: '0.25rem',
  fontWeight: 600,
  background: 'var(--accentBgColor)',
  color: 'var(--accentTextColor)',

  ':hover': {
    background: 'var(--accentBgHover)',
  },
});
