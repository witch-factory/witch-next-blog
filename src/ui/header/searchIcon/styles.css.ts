import { style } from '@vanilla-extract/css';

export const searchIconStyle = style({
  stroke: 'var(--textColor)',
  strokeWidth: '1.5px',
  strokeLinecap: 'round',
  width: '100%',

  ':hover': {
    stroke: 'var(--infoTextColor)',
  },
});
