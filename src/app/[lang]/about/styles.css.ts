import { style, globalStyle } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const marginBottom = style({
  marginBottom: '0.25rem',
});

export const marginy = style({
  margin: '0.5rem 0',
});

export const noMarker = style({
  listStyleType: 'none',
  paddingLeft: 0,
});

export const container = style({
  margin: '0 auto',
  maxWidth: '48rem',
});

export const introBox = style({
  'display': 'flex',
  'alignItems': 'center',
  'justifyContent': 'start',

  '@media': {
    '(min-width: 768px)': {
      justifyContent: 'flex-start',
      gap: '2rem',
      margin: '1rem 0',
    },
  },
});

export const mobileHidden = style({
  'display': 'none',

  '@media': {
    '(min-width: 768px)': {
      display: 'block',
    },
  },
});

globalStyle(`${container} *`, {
  lineHeight: 1.5,
  margin: 0,
});

globalStyle(`${container} a`, {
  color: themeColor.linkColor,
});

globalStyle(`${container} address`, {
  fontStyle: 'normal',
});

globalStyle(`${container} h1`, {
  margin: '1rem 0 0.5rem 0',
  paddingBottom: '0.25rem',
  fontWeight: 600,
});

globalStyle(`${container} h2`, {
  margin: '0.875rem 0 0.5rem 0',
  paddingBottom: '0.25rem',
});

globalStyle(`${container} :is(h2, h3, h4, h5, h6)`, {
  fontWeight: 500,
});

globalStyle(`${container} h2 a`, {
  borderBottom: 'none',
});

globalStyle(`${container} p`, {
  fontSize: '1rem',
  lineHeight: '1.75rem',
});

globalStyle(`${container} p + p`, {
  marginTop: '1rem',
});

globalStyle(`${container} ul`, {
  paddingLeft: '1.25rem',
  margin: '0.5rem 0',
});

globalStyle(`${container} li + li`, {
  margin: '0.5rem 0',
});
