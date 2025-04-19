import { sprinkles } from '@/styles/sprinkles.css';

export const postList = sprinkles({
  listStyle: 'none',
  padding: '0',
  margin: '0',
  gap: '1rem',
});

export const column = sprinkles({
  display: 'flex',
  flexDirection: 'column',
});

export const row = sprinkles({
  display: {
    mobile: 'flex',
    tablet: 'grid',
  },
  flexDirection: {
    mobile: 'column',
  },
  gridTemplateColumns: {
    tablet: 'repeat(3, 1fr)',
  },
});
