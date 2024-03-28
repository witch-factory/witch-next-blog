import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const searchIconStyle = style({
  stroke:themeColor.textColor,
  strokeWidth: '1.5px',
  strokeLinecap: 'round',
  width: '100%',

  ':hover': {
    stroke:themeColor.infoTextColor,
  },
});
