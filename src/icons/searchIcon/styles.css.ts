import { style } from '@vanilla-extract/css';

import { sprinkles } from '@/styles/sprinkles.css';
import { themeColor } from '@/styles/theme.css';

export const searchIconStyle = style([
  sprinkles({
    strokeWidth: '1.5px',
    strokeLinecap: 'round',
    width: '100%',
  }),
  {
    'stroke': themeColor.textColor,
    ':hover': {
      stroke: themeColor.infoTextColor,
    },
  },
]);
