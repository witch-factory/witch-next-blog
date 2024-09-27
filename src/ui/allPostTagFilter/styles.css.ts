import { style } from '@vanilla-extract/css';

export const title = style({
  fontSize: '1.25rem',
  margin:0,

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700
    }
  },
});

export const container = style({
  width: '100%',
  margin: '0 auto',

  '@media':{
    '(min-width: 768px)':{
      width: '90%',
    }
  }
});
