import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';
import { theme } from '@/styles/theme.css';

export const container = style([
  sprinkles({
    mx: 'auto',
    my: '0',
    py: '2rem',
    lineHeight: '1.5',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  }),
]);

export const content = sprinkles({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
});

export const header = sprinkles({
  display: 'flex',
  flexDirection: {
    mobile: 'column',
    tablet: 'row',
  },
  justifyContent: {
    mobile: 'normal',
    tablet: 'space-between',
  },
  gap: {
    mobile: '0.5rem',
    tablet: '0',
  },
});

export const headerMain = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const headerSub = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  alignItems: {
    mobile: 'flex-start',
    tablet: 'flex-end',
  },
});

export const headerIntro = sprinkles({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: '1rem',
});

export const group = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }),
  {
    borderTop: `3px solid ${theme.resumeAccentColor}`,
  },
]);

export const section = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

// .tech, .role
export const info = sprinkles({
  margin: '0',
  color: 'resumeInfoTextColor',
});

export const item = sprinkles({
});

export const period = sprinkles({
  color: 'resumeAccentColor',
  fontWeight: '700',
});

export const separator = style([
  sprinkles({
    width: '100%',
    mx: '0',
    my: '1rem',
  }),
  {
    borderTop: `1px solid ${theme.resumeAccentColor}`,
  },
]);

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
