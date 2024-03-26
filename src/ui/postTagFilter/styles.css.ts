import { style } from '@vanilla-extract/css';

export const tagList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  gap: '0.5rem',
});

export const container = style({
  width: '100%',
  margin: '0 auto',

  '@media':{
    '(min-width: 768px)':{
      width: '80%',
    }
  }
});

export const tagItem = style({
  backgroundColor: 'var(--accentBgColor)',
  color: 'var(--accentTextColor)',
  borderRadius: '9999px',

  ':hover':{
    backgroundColor: 'var(--accentBgHover)',
  },
});

export const selectedTagItem = style({
  backgroundColor: 'var(--accentBgHover)',
  borderRadius: '9999px',
  color: 'var(--accentTextColor)',
});

export const tagLink = style({
  display: 'block',
  width: '100%',
  height: '100%',
  padding:'0.25rem 0.5rem'
});