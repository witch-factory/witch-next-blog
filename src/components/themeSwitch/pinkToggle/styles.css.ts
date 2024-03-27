import { style, createTheme, keyframes } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  size:'2.25rem',
  pink2:'#fcc2d7',
  pink5:'#f06595',
  pink7:'#d6336c',

  darkPinkBgColor:'#f695c6',
  darkPinkIconColor:'#845ef7'
});

const starFall = keyframes({
  from:{
    transform:'translate(-1.5rem, -1.5rem)'
  },
  to:{
    transform:'translate(1.5rem, 1.5rem)'
  }
});


export const pinkThemeToggle = style({
  background:vars.pink2,

  border:'none',
  padding:0,

  inlineSize:vars.size,
  blockSize:vars.size,

  aspectRatio:'1',
  borderRadius:'50%',

  cursor:'pointer',

  touchAction:'manipulation',
  WebkitTapHighlightColor:'transparent',
  outlineOffset:'5px',

  overflow:'hidden',

  selectors:{
    ['[data-theme^=\'dark\'] &']:{
      background:vars.darkPinkBgColor
    }
  }
});

export const star = style({
  paddingTop:'3px',
  paddingLeft:'1px',

  '@media':{
    '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)':{
      selectors:{
        [`${pinkThemeToggle}:hover > &`]:{
          animation:`${starFall} 1s ease-in-out infinite`
        }
      }
    }
  }
});

export const starBody = style({
  stroke:vars.pink5,

  strokeWidth:'1.5px',
  strokeLinecap:'round',

  selectors:{
    ['[data-theme^=\'dark\'] &']:{
      stroke:vars.darkPinkIconColor
    }
  }
});