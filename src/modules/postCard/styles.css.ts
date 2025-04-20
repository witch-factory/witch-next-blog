import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';
import { themeColor } from '@/styles/theme.css';

export const container = sprinkles({
  borderRadius: '1rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

export const link = style([
  sprinkles({
    display: 'block',
    height: '100%',
    padding: '1rem',
    paddingLeft: '0',
    textDecoration: 'none',
    backgroundColor: 'bgColor',
    color: 'textColor',
    borderRadius: '1rem',
  }),
  {
    ':hover': {
      padding: '1rem',
      color: themeColor.lightAccentTextColor,
      backgroundColor: themeColor.contentBgColor,
      transition: '0.2s',
    },
  },
]);

export const image = sprinkles({
  width: '12rem',
  height: '8rem',
  display: {
    mobile: 'none',
    tablet: 'block',
  },
  margin: '0',
  marginRight: '1rem',
  borderRadius: '0.5rem',
  objectFit: 'fill',
});

export const introContainer = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: '0.75rem',
});
