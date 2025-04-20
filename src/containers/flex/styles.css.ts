import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const flex = recipe({
  base: sprinkles({
    display: 'flex',
  }),
  variants: {
    direction: {
      row: sprinkles({ flexDirection: 'row' }),
      column: sprinkles({ flexDirection: 'column' }),
    },
    justify: {
      start: sprinkles({ justifyContent: 'flex-start' }),
      center: sprinkles({ justifyContent: 'center' }),
      end: sprinkles({ justifyContent: 'flex-end' }),
      between: sprinkles({ justifyContent: 'space-between' }),
    },
    align: {
      start: sprinkles({ alignItems: 'flex-start' }),
      center: sprinkles({ alignItems: 'center' }),
    },
    wrap: {
      wrap: sprinkles({ flexWrap: 'wrap' }),
      nowrap: sprinkles({ flexWrap: 'nowrap' }),
    },
    gap: {
      none: sprinkles({ gap: '0' }),
      xs: sprinkles({ gap: '0.25rem' }),
      sm: sprinkles({ gap: '0.5rem' }),
      md: sprinkles({ gap: '0.75rem' }),
      lg: sprinkles({ gap: '1rem' }),
      xl: sprinkles({ gap: '2rem' }),
    },
  },
  defaultVariants: {
    direction: 'row',
  },
});

export type FlexVariants = RecipeVariants<typeof flex>;
