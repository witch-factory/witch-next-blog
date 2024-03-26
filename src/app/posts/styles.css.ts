import { style } from '@vanilla-extract/css';

export const inputStyle = style({
  width: '100%',
  height: '2.5rem',
  border: '1px solid var(--borderColor)',
  borderRadius: '0.25rem',

  margin: '1rem 0',
  padding: '0.5rem 0.75rem',
  backgroundColor: 'var(--bgColor)',
  color: 'var(--infoTextColor)',
  fontSize: '1rem',

  appearance: 'none',
  ':active': {
    outline: 'none',
    border: '2px solid var(--infoTextColor)',
  },
  ':focus': {
    outline: 'none',
    border: '2px solid var(--infoTextColor)',
  },

});