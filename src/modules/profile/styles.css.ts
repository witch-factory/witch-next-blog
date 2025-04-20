import { sprinkles } from '@/styles/sprinkles.css';

export const image = sprinkles({
  display: {
    mobile: 'none',
    tablet: 'block',
  },

  borderRadius: '50%',
  marginRight: '1.5rem',
  objectFit: 'cover',
});

export const profile = sprinkles({
  backgroundColor: 'contentBgColor',
  px: '1.5rem',
  py: '1rem',
  borderRadius: '1rem',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const link = sprinkles({
  textDecoration: 'none',
  color: 'lightAccentTextColor',
});
