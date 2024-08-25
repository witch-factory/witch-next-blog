import { style, globalStyle } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const marginBottom = style({
  marginBottom:'1rem',
});

export const noMarker = style({
  listStyleType:'none',
  paddingLeft:0,
});

export const container = style({});

globalStyle(`${container} h1`, {
  margin: '1rem 0 0.5rem 0',
  paddingBottom: '0.25rem',
  fontWeight: 600,
});

globalStyle(`${container} h2`, {
  margin: '0.875rem 0 0.5rem 0',
  paddingBottom: '0.25rem',
});

globalStyle(`${container} h2 a`, {
  borderBottom: 'none',
});

globalStyle(`${container} a`, {
  color:themeColor.linkColor,
});

globalStyle(`${container} h3`, {
  margin: '0.75rem 0 0.25rem 0',
});

globalStyle(`${container} h4`, {
  margin: '0.5rem 0 0.25rem 0',
});

globalStyle(`${container} :is(h2, h3, h4, h5, h6)`, {
  fontWeight:500,
});

globalStyle(`${container} :is(p, li)`, {
  lineHeight:1.5,
});

globalStyle(`${container} ul li:not(${noMarker})`, {
  marginLeft:'2rem',
});

globalStyle(`${container} hr`, {
  margin: '0.5rem 0',
});