import { sprinkles } from '@/styles/sprinkles.css';

export const postList = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  listStyle: 'none',
  padding: '0',
  margin: '0',
  gap: '1rem',
});

export const postGallery = sprinkles({
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
  width: '100%',
  listStyle: 'none',
  padding: '0',
  margin: '0',
  gap: '1rem',
});
