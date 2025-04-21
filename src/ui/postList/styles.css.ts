import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const postList = recipe({
  base: sprinkles({
    width: '100%',
    listStyle: 'none',
    padding: '0',
    margin: '0',
    gap: '1rem',
  }),
  variants: {
    direction: {
      row: sprinkles({
        display: {
          mobile: 'flex',
          tablet: 'grid',
        },
        flexDirection: {
          mobile: 'column',
        },
        gridTemplateColumns: {
          tablet: 'repeat(3, 1fr)',
        },
      }),
      column: sprinkles({
        display: 'flex',
        flexDirection: 'column',
      }),
    },
  },
  defaultVariants: {
    direction: 'column',
  },
});

export type PostListVariants = RecipeVariants<typeof postList>;
