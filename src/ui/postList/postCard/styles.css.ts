import { style } from '@vanilla-extract/css';

export const container = style({
  borderRadius: '1rem',
  boxSizing: 'border-box',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
});

export const link = style({
  display: 'block',
  height: '100%',
  padding: '1rem',
  paddingLeft: 0,
  textDecoration: 'none',
  color: 'var(--textColor)',

  ':hover': {
    padding: '1rem',
    borderRadius: '1rem',
    color: 'var(--lightAccentTextColor)',
    backgroundColor: 'var(--contentBgColor)',
    transition: '0.2s',
  },
});

export const image = style({
  display:'none',

  '@media':{
    '(min-width:640px)':{
      display:'block',
      width:'10rem',
      height:'7.5rem',
      objectFit:'fill',
      margin:0,
      marginRight:'1rem',
      borderRadius:'0.5rem'
    }
  }
});

export const introContainer = style({
  display:'flex',
  flexDirection:'column',
  justifyContent:'space-between',
  height:'100%'
});