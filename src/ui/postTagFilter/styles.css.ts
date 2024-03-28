import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const title = style({
  fontSize: '1.25rem',
  margin:0,
  marginBottom: '1rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700
    }
  },
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

export const container = style({
  width: '100%',
  margin: '0 auto',

  '@media':{
    '(min-width: 768px)':{
      width: '80%',
    }
  }
});

export const tagItem = style({
  backgroundColor:themeColor.accentBgColor,
  color: themeColor.accentTextColor,
  borderRadius: '9999px',

  ':hover':{
    backgroundColor:themeColor.accentBgHover,
  },
});

export const selectedTagItem = style({
  backgroundColor:themeColor.accentBgHover,
  color: themeColor.accentTextColor,
  borderRadius: '9999px',
});

export const tagLink = style({
  display: 'block',
  width: '100%',
  height: '100%',
  padding:'0.25rem 0.5rem'
});