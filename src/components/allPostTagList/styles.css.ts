import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const tagList = style({ 
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  listStyle: 'none',
  margin: '1rem 0',
  padding: 0,
  gap: '0.5rem',
});

export const tagItem = style({
  backgroundColor:themeColor.accentBgColor,
  color: themeColor.accentTextColor,
  borderRadius: '9999px',

  ':hover':{
    backgroundColor:themeColor.accentBgHover,
  },
});

export const tagPostCount = style({
  fontSize: '0.9rem',
  color: themeColor.infoTextColor,
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
  padding:'0.25rem 0.75rem'
});