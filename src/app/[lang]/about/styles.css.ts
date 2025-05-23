import { sprinkles } from '@/styles/sprinkles.css';

export const link = sprinkles({
  color: 'linkColor',
  textDecoration: 'none',
});

export const list = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  listStyle: 'disc',
  marginLeft: '1.25rem',
});
