import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const title = style({
  display:'block',
  fontSize:'1.25rem',
  fontWeight:700,
  marginBottom:'0.5rem',
});

export const container = style({
  marginTop:'2rem',
});

export const list = style({
  listStyle:'none',
  marginLeft:'1.5rem',
  fontSize:'0.875rem',

  selectors:{
    [`${container} > &`]:{
      marginLeft:0,
    }
  }
});

export const item = style({
  margin:0,
});

export const link = style({
  color:themeColor.infoTextColor,
  lineHeight:1.75,
  textDecoration:'underline',

  ':hover':{
    color:themeColor.lightAccentTextColor,
  }
});