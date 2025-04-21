import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';

export const container = sprinkles({
  mx: 'auto',
  width: '100%',
  minHeight: '100vh',
  maxWidth: '60rem',
});

export const inner = style([
  sprinkles({
    width: '92%',
    mx: 'auto',
    mt: {
      mobile: '0',
      desktop: '2rem',
    },
  }),
  {
    maxWidth: 'calc(100% - 48px)',
  },
]);
