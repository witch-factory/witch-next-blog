import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const list = recipe({
  base: sprinkles({
    display: 'flex',
    padding: '0',
    margin: '0',
    listStyle: 'none',
  }),
  variants: {
    direction: {
      row: sprinkles({ flexDirection: 'row' }),
      column: sprinkles({ flexDirection: 'column' }),
    },
    gap: {
      none: sprinkles({ gap: '0' }),
      sm: sprinkles({ gap: '0.5rem' }),
      md: sprinkles({ gap: '1rem' }),
      lg: sprinkles({ gap: '2rem' }),
    },
    wrap: {
      nowrap: sprinkles({ flexWrap: 'nowrap' }),
      wrap: sprinkles({ flexWrap: 'wrap' }),
    },
  },
  defaultVariants: {
    direction: 'row',
    gap: 'sm',
    wrap: 'nowrap',
  },
});

export type ListVariants = RecipeVariants<typeof list>;
