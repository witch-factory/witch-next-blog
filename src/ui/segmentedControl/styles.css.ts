import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';

export const container = style([
  sprinkles({
    display: 'flex',
    flexDirection: {
      mobile: 'row',
      desktop: 'column',
    },
    position: {
      mobile: 'static',
      desktop: 'fixed',
    },
    borderRadius: '0.5rem',
    backgroundColor: 'contentBgColor',
    mt: {
      mobile: '1rem',
      desktop: '0',
    },
    ml: {
      mobile: '0',
      desktop: '1rem',
    },
    marginBottom: '1rem',
    width: 'fit-content',
    gap: '0.25rem',
    padding: '0.25rem',
  }),
  {
    '@media': {
      '(min-width: 1120px)': {
        left: 'calc(48% + 30rem)',
      },
    },
  },
]);

export const label = sprinkles({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  py: '0.5rem',
  px: '1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '400',
  color: {
    default: 'textColor',
    hover: 'lightAccentTextColor',
  },
  backgroundColor: {
    default: 'contentBgColor',
    hover: 'contentBgHover',
  },
  border: 'none',
});

export const selected = sprinkles({
  backgroundColor: 'accentBgColor',
  color: 'accentTextColor',
  fontWeight: '700',
});

export const input = sprinkles({
  display: 'none',
});
