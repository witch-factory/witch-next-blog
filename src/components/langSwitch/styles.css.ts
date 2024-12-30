import { style } from '@vanilla-extract/css';

export const buttonStyle = style({
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '0.5rem',
  marginLeft: '0.5rem',
  padding: '0.5rem 1.5rem',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',

  selectors: {
    '&:hover': {
      backgroundColor: '#005bb5',
    },
    '&:focus': {
      outline: '2px solid #005bb5',
      outlineOffset: '2px',
    },
  },
});
