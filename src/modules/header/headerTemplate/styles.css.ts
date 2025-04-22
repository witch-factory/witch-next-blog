import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';
import { themeColor } from '@/styles/theme.css';

export const header = style({
  width: '100%',
  height: '3.125rem',
  position: 'sticky',
  top: 0,
  backgroundColor: themeColor.bgColor,
  borderBottom: `1px solid ${themeColor.headerBorderColor}`,
  margin: '0 auto',
  zIndex: 50,
});

export const nav = sprinkles({
  width: '100%',
  maxWidth: '60rem',
  height: '100%',
  mx: 'auto',
});

export const container = sprinkles({
  width: '92%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  mx: 'auto',
});

export const search = style({
  'flexShrink': 0,
  'width': '2.5rem',
  'height': '100%',
  'display': 'flex',
  'flexDirection': 'row',
  'alignItems': 'center',

  ':hover': {
    backgroundColor: themeColor.contentBgHover,
  },
});

export const item = style({
  'width': '4rem',

  '@media': {
    '(min-width: 768px)': {
      width: '5rem',
    },
  },
});

export const link = style({
  'textDecoration': 'none',
  'color': themeColor.textColor,
  'display': 'block',
  'width': '4rem',
  'height': '3.125rem',
  'textIndent': 0,
  'lineHeight': '3.125rem',
  'textAlign': 'center',

  ':hover': {
    backgroundColor: themeColor.contentBgHover,
  },

  '@media': {
    '(min-width: 768px)': {
      width: '5rem',
    },
  },
});

export const linkContainer = style({
  'textDecoration': 'none',
  'color': themeColor.textColor,
  'display': 'block',
  'width': 'fit-content',
  'padding': '0.25rem',
  'paddingLeft': 0,

  ':hover': {
    backgroundColor: themeColor.contentBgHover,
  },
});

export const logoContainer = sprinkles({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  gap: '0.25rem',
});

export const logo = style({
  display: 'block',
  width: '3.125rem',
  height: '3.125rem',
});

export const blogTitle = sprinkles({
  fontSize: '1.5rem',
  fontWeight: '700',
  display: {
    mobile: 'none',
    tablet: 'block',
  },
});
