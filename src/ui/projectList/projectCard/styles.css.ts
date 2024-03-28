import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const wrapper = style({
  display: 'block',
  width: '100%',
  height: '100%',
});

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'min-content',
  gridTemplateRows: '1.5rem',
  columnGap: '1rem',
  rowGap: '0.5rem',
  height: '100%',

  ':hover':{
    color:themeColor.lightAccentTextColor,
  },

  '@media':{
    '(min-width: 768px)':{
      flexDirection: 'column',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1.5rem min-content',
    }
  }
});


export const imageBox = style({
  gridColumn: '1 / 2',
  gridRow: '1 / 3',
  height: '100%',
  borderRadius: '0.5rem',

  '@media':{
    '(min-width: 768px)':{
      gridColumn: '1 / 2',
      gridRow: '2 / 3',
    }
  },

  selectors:{
    [`${container}:hover &`]:{
      marginTop: '-3px',
      paddingBottom: '3px',
      boxShadow: '3px 3px 5px var(--shadowColor)',
      transition: 'all 0.3s ease-out'
    }
  }
});

export const title = style({
  fontSize: '1.2rem',
  fontWeight: 600,

  '@media':{
    '(min-width: 768px)':{
      fontSize: '1.25rem',
    }
  }
});

export const titleBox = style({
  gridColumn:'2 / 3',
  gridRow:'1 / 2',
  height:'100%',

  '@media':{
    '(min-width: 768px)':{
      gridColumn: '1 / 2',
      gridRow: '1 / 2',
      height: '100%',
    }
  }
});

export const introBox = style({
  gridColumn: '2 / 3',
  gridRow: '2 / 3',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',

  '@media':{
    '(min-width: 768px)':{
      gridColumn: '1 / 2',
      gridRow: '3 / 4',

      justifyContent: 'flex-start',
      height: '100%',
      gap: '0.5rem',
    }
  }
});

export const imageContainer = style({
  display: 'block',
  position: 'relative',

  '@media':{
    '(min-width: 768px)':{
      width: '100%',
    }
  }
});

export const image = style({
  margin:0,
  objectFit: 'fill',
  width: '7.5rem',
  height: '100%',
  aspectRatio: '1/1',
  borderRadius: '0.5rem',

  '@media':{
    '(min-width: 768px)':{
      display: 'block',
      objectFit: 'contain',
      width: '100%',
      height: 'auto',
      aspectRatio: 'auto',
    }
  }

});

export const description = style({
  wordBreak: 'keep-all',
  lineHeight: 1.2,
  marginTop: 0,
  marginBottom: 0,
});