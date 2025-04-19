import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const badge = recipe({
  base: sprinkles({
    display: 'inline-flex',
    fontWeight: '400',
    whiteSpace: 'nowrap',
  }),
  variants: {
    size: {
      sm: sprinkles({ fontSize: '0.8rem', px: '0.5rem', py: '0.25rem' }),
      md: sprinkles({ fontSize: '1rem', px: '0.75rem', py: '0.25rem' }),
      lg: sprinkles({ fontSize: '1rem', px: '1rem', py: '0.5rem' }),
    },
    color: {
      normal: sprinkles({
        backgroundColor: 'accentBgColor',
        color: 'accentTextColor',
      }),
      accent: sprinkles({
        backgroundColor: 'accentBgHover',
        color: 'accentTextColor',
      }),
    },
    hover: {
      none: sprinkles({}),
      background: sprinkles({
        backgroundColor: {
          default: 'accentBgColor',
          hover: 'accentBgHover',
        },
      }),
    },
    radius: {
      none: sprinkles({ borderRadius: '0' }),
      sm: sprinkles({ borderRadius: '0.25rem' }),
      md: sprinkles({ borderRadius: '0.5rem' }),
      lg: sprinkles({ borderRadius: '1rem' }),
      full: sprinkles({ borderRadius: '9999px' }),
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'normal',
    radius: 'sm',
    hover: 'none',
  },
});

export type BadgeVariants = RecipeVariants<typeof badge>;
