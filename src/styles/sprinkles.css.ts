import {
  defineProperties,
  createSprinkles,
} from '@vanilla-extract/sprinkles';

import { themeColor } from './theme.css';

const spacing = ['0', '0.25rem', '0.5rem', '1rem', '2rem', 'auto'];
const fontSizes = ['0.875rem', '1rem', '1.25rem', '1.5rem', '2.25rem'];
const colors = themeColor;

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1120px)' },
  },
  defaultCondition: 'mobile',
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['none', 'block', 'inline', 'inline-flex', 'flex', 'grid'],
    flexDirection: ['row', 'column'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    alignItems: ['flex-start', 'center', 'flex-end'],
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
    borderRadius: ['0', '0.25rem', '0.5rem', '1rem', '50%'],
    overflow: ['visible', 'hidden', 'auto'],
    whiteSpace: ['normal', 'nowrap', 'pre-wrap'],
    strokeLinecap: ['round'],
    strokeWidth: ['1.5px'],
    backgroundColor: colors,
    color: colors,
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
