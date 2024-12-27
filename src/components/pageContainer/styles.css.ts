import { style } from '@vanilla-extract/css';

export const container = style({
  margin: '0 auto',
  width: '100%',
  minHeight: '100vh',
  maxWidth: '60rem',
});

export const inner = style({
  width: '92%',
  maxWidth: 'calc(100% - 48px)',
  margin: '0 auto',
  marginTop: '2rem',
});
