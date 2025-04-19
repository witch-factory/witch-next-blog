import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const separator = style({
  height: '1px',
  width: '100%',
  backgroundColor: themeColor.headerBorderColor,
  margin: '1rem 0',
  border: 'none',
});
