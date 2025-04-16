import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

import { sprinkles } from '@/styles/sprinkles.css';
import { themeColor } from '@/styles/theme.css';

export const badge = recipe({
  base: sprinkles({
    display: 'inline-flex',
  }),
  variants: {
    color: {
      normal: sprinkles({
        backgroundColor: themeColor.accentBgColor,
        color: 'accentTextColor',
      }),
      accent: sprinkles({
        backgroundColor: 'accentBgHover',
        color: 'accentTextColor',
      }),
    },
  },
});

export type BadgeVariants = RecipeVariants<typeof badge>;
