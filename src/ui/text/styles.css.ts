import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';

export const text = recipe({
  base: sprinkles({
    margin: '0',
    wordBreak: 'keep-all',
  }),
  variants: {
    size: {
      xs: sprinkles({ fontSize: '0.8rem', lineHeight: '1.2' }),
      sm: sprinkles({ fontSize: '0.9rem', lineHeight: '1.2' }),
      md: sprinkles({ fontSize: '1rem', lineHeight: '1.5' }),
      lg: sprinkles({ fontSize: '1.125rem', lineHeight: '1.5' }),
      xl: sprinkles({ fontSize: '1.25rem', lineHeight: '1.5' }),
    },
    color: {
      default: sprinkles({ color: 'inherit' }),
      text: sprinkles({ color: 'textColor' }),
      info: sprinkles({ color: 'infoTextColor' }),
      accent: sprinkles({ color: 'accentTextColor' }),
    },
    weight: {
      normal: sprinkles({ fontWeight: '400' }),
      medium: sprinkles({ fontWeight: '500' }),
      bold: sprinkles({ fontWeight: '700' }),
    },
    decoration: {
      underline: sprinkles({ textDecoration: 'underline' }),
      none: sprinkles({ textDecoration: 'none' }),
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    weight: 'normal',
    decoration: 'none',
  },
});

export type TextVariants = RecipeVariants<typeof text>;
