import { sprinkles } from '@/styles/sprinkles.css';

export const footer = sprinkles({
  backgroundColor: 'contentBgColor',
  color: 'infoTextColor',
  mt: '4rem',
  py: '2rem',
  px: '0',
});

export const container = sprinkles({
  maxWidth: '60rem',
  mx: 'auto',
});

export const inner = sprinkles({
  width: '92%',
  mx: 'auto',
  my: '0',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem',

  gap: '0.75rem',
});
