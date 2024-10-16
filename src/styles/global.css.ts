import { globalStyle } from '@vanilla-extract/css';

globalStyle('.title-md', {
  fontSize: '1.25rem',

  '@media': {
    '(min-width: 768px)': {
      fontSize: '1.5rem',
      fontWeight: 700
    }
  }
});

globalStyle('.mb-3', {
  margin: 0,
  marginBottom: '0.75rem',
});