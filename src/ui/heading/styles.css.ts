import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const heading = recipe({
  base: sprinkles({
    fontWeight: '700',
    lineHeight: '1.2',
    margin: '0',
  }),
  variants: {
    size: {
      xl: sprinkles({
        fontSize: {
          mobile: '1.75rem',
          tablet: '2rem',
        },
      }),
      lg: sprinkles({
        fontSize: {
          mobile: '1.5rem',
          tablet: '1.75rem',
        },
      }),
      md: sprinkles({
        fontSize: {
          mobile: '1.25rem',
          tablet: '1.5rem',
        },
      }),
      sm: sprinkles({
        fontSize: {
          mobile: '1.2rem',
          tablet: '1.25rem',
        },
      }),
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type HeadingVariants = RecipeVariants<typeof heading>;
