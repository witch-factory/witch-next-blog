import { sprinkles } from '@/styles/sprinkles.css';

export const container = sprinkles({
  mx: 'auto',
  my: '1.5rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const dotts = sprinkles({
  px: '1rem',
  py: '0.5rem',
  fontWeight: '500',
});

export const item = sprinkles({
  px: '1rem',
  py: '0.5rem',
  borderRadius: '0.25rem',
  fontWeight: '500',
  backgroundColor: {
    default: 'inherit',
    hover: 'contentBgHover',
  },
});

export const selected = sprinkles({
  px: '1rem',
  py: '0.5rem',
  borderRadius: '0.25rem',
  fontWeight: '500',
  backgroundColor: {
    default: 'accentBgColor',
    hover: 'accentBgHover',
  },
  color: 'accentTextColor',
});
