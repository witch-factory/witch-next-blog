import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const container = style({
  marginBottom: '1rem',
});

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const title = style({
  'margin': 0,
  'marginBottom': '0.5rem',
  'fontSize': '1.25rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
  },
});

export const toggle = style({
  'width': '70px',
  'height': '30px',
  'border': 'none',
  'borderRadius': '5px',
  'backgroundColor': themeColor.accentBgColor,
  'color': themeColor.accentTextColor,

  ':hover': {
    backgroundColor: themeColor.accentBgHover,
  },

  '@media': {
    '(min-width: 768px)': {
      display: 'none',
    },

  },
});

export const list = style({
  'listStyle': 'none',
  'marginLeft': 0,
  'padding': 0,
  'paddingTop': '3px',
  'display': 'grid',
  'gridTemplateColumns': '1fr',
  'gridTemplateRows': '1fr',
  'gap': '0.5rem',
  'rowGap': '1rem',
  'width': '100%',

  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(4,1fr)',
      gridAutoRows: '1fr',
      columnGap: '1rem',
    },
  },
});

export const listOpen = style({
  gridAutoRows: '1fr',
});

export const listClose = style({
  gridAutoRows: '0',
  overflow: 'hidden',
  rowGap: '0',
});
