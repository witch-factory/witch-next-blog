import { style } from '@vanilla-extract/css';

export const container = style({
  marginBottom: '2rem',
});

export const titleLink = style({
  margin: 0,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius: '1rem',

  ':hover':{
    transition: 'all 0.2s ease-in-out',
    backgroundColor: 'var(--contentBgColor)',
    paddingLeft: '1rem',
  }
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