import { style } from '@vanilla-extract/css';

export const container = style({
  marginBottom: '2rem',
});

export const title = style({
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