import { style } from '@vanilla-extract/css';

import { theme } from '@/styles/theme.css';

export const container = style({
  'display': 'flex',
  'flexDirection': 'column',
  'justifyContent': 'center',
  'gap': '0.5rem',
  'marginTop': '0.5rem',
  'marginLeft': '1.5rem',
  'marginBottom': '1rem',

  '@media': {
    '(min-width: 1120px)': {
      position: 'absolute',
      top: '4rem',
      left: 'calc(48% + 30rem)',
    },
  },
});

export const title = style({
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

export const buttonContainer = style({
  display: 'flex',
  gap: '0.5rem',
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

  '@media': {
    '(min-width: 1120px)': {
      padding: '0.5rem',
    },
  },
});

export const activeButton = style({
  fontWeight: 'bold',
  textDecoration: 'underline',
});
