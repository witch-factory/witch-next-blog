import { style } from '@vanilla-extract/css';

export const container = style({
  marginBottom: '2rem',
});


export const title = style({
  fontSize: '1.25rem',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700
    }
  }
});