import { style } from '@vanilla-extract/css';

import { theme } from '@/styles/theme.css';

export const container = style({
  'display': 'flex',
  'flexDirection': 'row',
  'gap': '1rem',
  'marginTop': '1rem',
  'marginBottom': '1rem',

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

export const title = style({
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

export const button = style({
  'backgroundColor': theme.lightAccentTextColor,
  'color': theme.bgColor,
  'border': 'none',
  'borderRadius': '0.5rem',
  'padding': '0.5rem 1.5rem',
  'fontSize': '1rem',
  'cursor': 'pointer',
  'transition': 'background-color 0.3s ease',

  ':hover': {
    backgroundColor: theme.accentTextColor,
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
