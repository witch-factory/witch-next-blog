import {
  defineProperties,
  createSprinkles,
} from '@vanilla-extract/sprinkles';

import { themeColor } from './theme.css';

const spacing = ['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem', '2rem', '3rem', 'auto'];
const fontSizes = ['0.8rem', '0.9rem', '1rem', '1.125rem', '1.2rem', '1.25rem', '1.5rem', '1.75rem', '2rem'];
const colors = {
  ...themeColor,
  transparent: 'transparent',
  inherit: 'inherit',
};

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1120px)' },
    print: { '@media': 'print' },

    default: {},
    hover: {
      selector: '&:hover',
    },
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    display: ['none', 'block', 'inline', 'inline-flex', 'flex', 'grid'],
    gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
    flexDirection: ['row', 'column'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    alignItems: ['flex-start', 'center', 'flex-end'],
    flexWrap: ['nowrap', 'wrap'],
    fontSize: fontSizes,
    fontWeight: ['400', '500', '700'],
    textAlign: ['left', 'center', 'right'],
    lineHeight: ['1', '1.2', '1.5', '1.75'],
    padding: spacing,
    paddingTop: spacing,
    paddingBottom: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,
    margin: spacing,
    marginTop: spacing,
    marginBottom: spacing,
    marginLeft: spacing,
    marginRight: spacing,
    gap: spacing,
    rowGap: spacing,
    columnGap: spacing,
    width: ['auto', '92%', '100%', 'fit-content'],
    height: ['auto', '100%'],
    minHeight: ['auto', '100vh'],
    maxWidth: ['60rem'],
    border: ['none', '1px solid'],
    borderRadius: ['0', '0.25rem', '0.5rem', '1rem', '9999px', '50%'],
    overflow: ['visible', 'hidden', 'auto'],
    whiteSpace: ['normal', 'nowrap', 'pre-wrap'],
    strokeLinecap: ['round'],
    strokeWidth: ['1.5px'],
    listStyle: ['none'],
    textDecoration: ['none', 'underline'],
    wordBreak: ['normal', 'break-all', 'keep-all'],
    backgroundColor: colors,
    color: colors,
    objectFit: ['cover', 'fill'],
    cursor: ['pointer', 'default'],
  },
  shorthands: {
    p: ['padding'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
