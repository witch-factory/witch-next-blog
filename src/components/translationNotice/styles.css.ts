import { style } from '@vanilla-extract/css';

import { theme } from '@/styles/theme.css';

export const container = style({
  background: theme.codeBlockBgColor,
  color: theme.codeBlockTextColor,
  padding: '1rem',
  borderRadius: '0.5rem',
  margin: '1rem 0',
});
