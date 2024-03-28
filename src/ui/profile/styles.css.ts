import { style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const image = style({
  display: 'none',

  '@media':{
    '(min-width:768px)':{
      display: 'block',
      borderRadius: '50%',
      marginTop: '1.25rem',
      marginRight: '1.25rem',
      objectFit: 'cover',
    },
  },
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

export const description = style({
  wordBreak: 'keep-all',
  lineHeight: 1.2,
  marginTop: '0.5rem',
  marginBottom: '0.5rem',

  '@media': {
    '(min-width: 768px)': {
      lineHeight: 1.5
    }
  }
});

export const profile = style({
  backgroundColor:themeColor.contentBgColor,
  margin: '1.25rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '1rem',

  '@media':{
    /* 화면 너비가 클 시 사진과 소개를 가로 배열 */
    '(min-width:768px)':{
      display: 'flex',
      flexDirection: 'row',
    },
  },
});