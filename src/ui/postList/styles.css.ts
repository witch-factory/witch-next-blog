import { style } from '@vanilla-extract/css';

export const postList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  gap: '1rem',
});

export const column = style({
  flexDirection: 'column',
});

export const row = style({
  'flexDirection': 'column',

  '@media': {
    '(min-width:768px)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
    },
  },
});
