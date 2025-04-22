import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';

export const time = sprinkles({
  display: 'block',
  fontSize: '1.25rem',
  fontWeight: '400',
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

export const link = sprinkles({
  color: {
    default: 'infoTextColor',
    hover: 'lightAccentTextColor',
  },
  lineHeight: '1.75',
  textDecoration: 'underline',
});

export const notice = sprinkles({
  backgroundColor: 'codeBlockBgColor',
  color: 'codeBlockTextColor',
  padding: '1rem',
  borderRadius: '0.5rem',
});
