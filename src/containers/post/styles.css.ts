import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const time = style({
  display: 'block',
  fontSize: '1.25rem',
  fontWeight: 400,
});

export const list = style({
  listStyle: 'none',
  fontSize: '0.875rem',

  selectors: {
    [`ul &`]: {
      marginLeft: '1.5rem',
    },
  },
});

export const link = style({
  'color': themeColor.infoTextColor,
  'lineHeight': 1.75,
  'textDecoration': 'underline',

  ':hover': {
    color: themeColor.lightAccentTextColor,
  },
});

export const notice = style({
  background: themeColor.codeBlockBgColor,
  color: themeColor.codeBlockTextColor,
  padding: '1rem',
  borderRadius: '0.5rem',
});
