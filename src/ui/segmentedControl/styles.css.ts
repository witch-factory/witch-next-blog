import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const container = style({
  'display': 'flex',
  'flexDirection': 'row',
  'borderRadius': '0.5rem',
  'backgroundColor': themeColor.contentBgColor,
  'marginTop': '1rem',
  'marginBottom': '1rem',
  'width': 'fit-content',
  'gap': '0.25rem',
  'padding': '0.25rem',

  '@media': {
    '(min-width: 1120px)': {
      position: 'fixed',

      left: 'calc(48% + 30rem)',
      marginTop: '0',
      marginLeft: '1rem',

      flexDirection: 'column',
    },
  },
});

export const label = style({
  'display': 'inline-flex',
  'alignItems': 'center',
  'justifyContent': 'center',
  'padding': '0.5rem 1rem',
  'borderRadius': '0.5rem',
  'cursor': 'pointer',
  'fontSize': '1rem',
  'fontWeight': 'normal',
  'color': themeColor.textColor,
  'backgroundColor': 'transparent',
  'border': 'none',

  ':hover': {
    backgroundColor: themeColor.contentBgHover,
    color: themeColor.lightAccentTextColor,
  },
});

export const selected = style({
  backgroundColor: themeColor.accentBgColor,
  color: themeColor.accentTextColor,
  fontWeight: 'bold',
});

export const input = style({
  display: 'none',
});

export const button = style({
  'backgroundColor': themeColor.lightAccentTextColor,
  'color': themeColor.bgColor,
  'border': 'none',
  'borderRadius': '0.5rem',
  'padding': '0.5rem 1.5rem',
  'fontSize': '1rem',
  'cursor': 'pointer',
  'transition': 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: themeColor.accentTextColor,
  },

  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '@media': {
    '(min-width: 1120px)': {
      padding: '0.5rem 1.5rem',
    },
  },
});

export const activeButton = style({
  fontWeight: 'bold',
  textDecoration: 'underline',
});
