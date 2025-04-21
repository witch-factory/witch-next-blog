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
    listStyle: {
      none: sprinkles({ listStyle: 'none' }),
      disc: sprinkles({ listStyle: 'disc', marginLeft: '1.5rem' }),
      circle: sprinkles({ listStyle: 'circle', marginLeft: '1.5rem' }),
    },
  },
  defaultVariants: {
    direction: 'row',
    gap: 'sm',
    wrap: 'nowrap',
    listStyle: 'none',
  },
});

export type ListVariants = RecipeVariants<typeof list>;
