import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const linkContainer = style({
  textDecoration: 'none',
  color:themeColor.textColor,
  display: 'block',
  width: 'fit-content',
  padding: '0.25rem',
  paddingLeft: 0,

  ':hover': {
    backgroundColor: themeColor.contentBgHover,
  },

  '@media':{
    '(min-width: 640px)':{
      paddingLeft: '0.25rem'
    }
  },
});

export const container = style({
  display:'flex',
  flexDirection:'row',
  alignItems:'center',
  width:'100%',
  height:'100%',

  '@media':{
    '(min-width: 640px)':{
      gap: '0.25rem'
    }
  },
});

export const url = style({
  display:'none',

  '@media':{
    '(min-width: 640px)':{
      display:'inline'
    }
  },
});

export const logo = style({
  display:'block',
  width:'2.5rem',
  height:'2.5rem',

  '@media':{
    '(min-width: 768px)':{
      width:'3.125rem',
      height:'3.125rem'
    }
  }
});