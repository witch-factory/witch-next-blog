import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { theme } from '@/styles/theme.css';

export const container = style({
  'margin': '0 auto',

  'lineHeight': '1.5',
  'boxSizing': 'border-box',
  'fontFamily': 'Inter, sans-serif',

  'display': 'flex',
  'flexDirection': 'column',
  'gap': '2rem',

  '@media': {
    '(min-width: 768px)': {
      padding: '2rem',
    },
  },
});

export const content = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

export const header = style({
  'display': 'flex',
  'flexDirection': 'column',
  'gap': '0.5rem',

  '@media': {
    '(min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 0,
    },
  },
});

export const headerMain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const headerSub = style({
  'display': 'flex',
  'flexDirection': 'column',
  'gap': '0.25rem',
  'alignItems': 'flex-start',

  '@media': {
    '(min-width: 768px)': {
      alignItems: 'flex-end',
    },
  },
});

export const headerIntro = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: '1rem',
});

export const contact = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const group = style({
  borderTop: `3px solid ${theme.resumeAccentColor}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

// .tech, .role
export const info = style({
  margin: 0,
  color: theme.resumeInfoTextColor,
});

export const item = style({
});

export const period = style({
  color: theme.resumeAccentColor,
  fontWeight: 'bold',
});

export const separator = style({
  width: '100%',
  borderTop: `1px solid ${theme.resumeAccentColor}`,
  margin: '1rem 0',
});

export const title = recipe({
  base: {
    fontWeight: 'bold',
    margin: 0,
  },
  variants: {
    weight: {
      normal: {
        fontWeight: 'normal',
      },
      bold: {
        fontWeight: 'bold',
      },
    },
    size: {
      // .title-lg와 같다
      xl: {
        fontSize: '2.5rem',
        lineHeight: '3rem',
        letterSpacing: '0.025rem',
        marginBottom: '0.5rem',
      },
      // .title-md와 같다
      lg: {
        fontSize: '1.5rem',
        lineHeight: '2rem',
      },
      // .title-link와 같다
      md: {
        fontWeight: 'normal',
        fontSize: '1.2rem',
        lineHeight: '1.75rem',
      },
      // .title-sm와 같다
      sm: {
        fontSize: '1rem',
        lineHeight: '1.75rem',
        marginBottom: '0.25rem',
      },
      // .title-accent와 같다
      accent: {
        fontSize: '1.25rem',
        color: theme.resumeAccentColor,
        marginTop: '0.25rem',
      },
    },
  },
  defaultVariants: {
    weight: 'bold',
    size: 'lg',
  },
});

globalStyle(`${container} p`, {
  margin: 0,
});

globalStyle(`${container} a`, {
  color: theme.resumeInfoTextColor,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2rem',
});

globalStyle(`${container} ul`, {
  margin: 0,
  paddingLeft: '1.25rem',
});

globalStyle(`${container} ul li + li`, {
  marginTop: '0.25rem',
});
