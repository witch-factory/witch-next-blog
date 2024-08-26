import { style, globalStyle } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const marginBottom = style({
  marginBottom:'1rem',
});

export const noMarker = style({
  listStyleType:'none',
  paddingLeft:0,
});

export const container = style({
  margin: '0 auto',
  maxWidth: '48rem',

  '@media': {
    '(min-width: 768px)': {
      padding: '2rem',
    }
  }
});

globalStyle(`${container} *`, {
  lineHeight: '1.5',
  margin: 0,
});

globalStyle(`${container} address`, {
  fontStyle: 'normal',
});

globalStyle(`${container} p`, {
  fontSize: '1rem',
  lineHeight: '1.75rem',
});

globalStyle(`${container} h1`, {
  fontWeight: 'bold',
  fontSize: '2rem',
  lineHeight: '2.5rem',
});

globalStyle(`${container} h2`, {
  fontWeight: 'bold',
  fontSize: '1.5rem',
  lineHeight: '2rem',
});

globalStyle(`${container} h3`, {
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
});

globalStyle(`${container} h4`, {
  fontWeight: 'bold',
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  margin: '1rem 0',
});

globalStyle(`${container} h2 a`, {
  borderBottom: 'none',
});

globalStyle(`${container} a`, {
  color:themeColor.linkColor,
  textDecoration: 'none',
});

globalStyle(`${container} section`, {
  marginBottom: '2rem',
});


globalStyle(`${container} ul`, {
  paddingLeft: '1.25rem',
  margin: '0.5rem 0',
});

globalStyle(`${container} li + li`, {
  margin: '0.5rem 0',
});

globalStyle(`${container} hr`, {
  border: 'none',
  borderTop: `0.125rem solid ${themeColor.borderColor}`,
  marginTop:'0.5rem',
  marginBottom:'1rem',
});

globalStyle(`${container} .intro`, {
  margin: '1rem 0',
});

globalStyle(`${container} .text-muted`, {
  color: themeColor.infoTextColor
});