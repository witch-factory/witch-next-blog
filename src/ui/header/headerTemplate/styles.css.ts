import { style } from '@vanilla-extract/css';

export const header = style({
  width: '100%',
  height: '50px',
  position: 'sticky',
  top: 0,
  backgroundColor: 'var(--bgColor)',
  borderBottom: '1px solid var(--headerBorderColor)',
  margin: '0 auto',
  zIndex: 50,
});

export const nav = style({
  width: '100%',
  maxWidth: '60rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '0 auto',
});

export const container = style({
  width: '92%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '0 auto',
});

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const search = style({
  flexShrink: 0,
  width: '2.5rem',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  ':hover': {
    background: 'var(--contentBgHover)',
  },
});

export const list = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  backgroundColor: 'var(--bgColor)',
  border: 'none',
  boxSizing: 'border-box',
  position: 'static',
});

export const item = style({
  width: '3.75rem',

  '@media':{
    '(min-width: 640px)':{
      width: '5rem',
    },
  },
});

export const link = style({
  textDecoration: 'none',
  color: 'var(--textColor)',
  display: 'block',
  width: '3.75rem',
  height: '3.125rem',
  textIndent: 0,
  lineHeight: '3.125rem',
  textAlign: 'center',

  ':hover': {
    background: 'var(--contentBgHover)',
  },

  '@media':{
    '(min-width: 640px)':{
      width: '5rem',
    },
  },
});