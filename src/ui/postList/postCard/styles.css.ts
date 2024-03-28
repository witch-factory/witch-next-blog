import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const container = style({
  borderRadius: '1rem',
  boxSizing: 'border-box',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

export const title = style({
  fontSize: '1.2rem',
  margin: 0,
  marginBottom: '0.75rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.25rem'
    }
  }
});

export const description = style({
  wordBreak: 'keep-all',
  lineHeight: 1.2,
  margin: 0,
  marginBottom: '0.75rem',

  '@media': {
    '(min-width: 768px)': {
      lineHeight: 1.5
    }
  }
});

export const link = style({
  display: 'block',
  height: '100%',
  padding: '1rem',
  paddingLeft: 0,
  textDecoration: 'none',
  color:themeColor.textColor,

  ':hover': {
    padding: '1rem',
    borderRadius: '1rem',
    color:themeColor.lightAccentTextColor,
    backgroundColor:themeColor.contentBgColor,
    transition: '0.2s',
  },
});

export const image = style({
  display:'none',

  '@media':{
    '(min-width:640px)':{
      display:'block',
      width:'10rem',
      height:'7.5rem',
      objectFit:'fill',
      margin:0,
      marginRight:'1rem',
      borderRadius:'0.5rem'
    }
  }
});

export const introContainer = style({
  display:'flex',
  flexDirection:'column',
  justifyContent:'space-between',
  height:'100%'
});