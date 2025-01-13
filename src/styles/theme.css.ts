import { createGlobalTheme, createTheme, createThemeContract } from '@vanilla-extract/css';

// color scheme from https://yeun.github.io/open-color/
export const globalVars = createGlobalTheme(':root', {
  color: {
    white: '#fff',
    black: '#000',

    gray5: '#adb5bd',
    indigo7: '#4263eb',
  },
});

export const theme = createThemeContract({
  bgColor: '',
  textColor: '',

  contentBgColor: '',
  contentBgHover: '',
  headerBorderColor: '',
  borderColor: '',
  shadowColor: '',
  infoTextColor: '',

  codeBlockBgColor: '',
  codeBlockTextColor: '',
  accentBgColor: '',
  accentBgHover: '',
  accentTextColor: '',
  lightAccentTextColor: '',
  linkColor: '',
});

export const lightTheme = createTheme(theme, {
  bgColor: '#ffffff',
  textColor: '#28292D',

  contentBgColor: '#f1f3f5',
  contentBgHover: '#e9ecef',
  headerBorderColor: '#dee2e6',
  borderColor: '#adb5bd',
  shadowColor: '#868e96',
  infoTextColor: '#495057',

  codeBlockBgColor: '#edf2ff',
  codeBlockTextColor: '#364fc7',
  accentBgColor: '#dbe4ff',
  accentBgHover: '#bac8ff',
  accentTextColor: '#3b5bdb',
  lightAccentTextColor: '#4c6ef5',
  linkColor: '#4263eb',
});

export const darkTheme = createTheme(theme, {
  bgColor: '#212529',
  textColor: '#ececec',

  contentBgColor: '#343a40',
  contentBgHover: '#343a40',
  headerBorderColor: '#495057',
  borderColor: '#868e96',
  shadowColor: '#868e96',
  infoTextColor: '#ced4da',

  codeBlockBgColor: '#343a40',
  codeBlockTextColor: '#edf2ff',
  accentBgColor: '#002395',
  accentBgHover: '#2b4aaf',
  accentTextColor: '#edf2ff',
  lightAccentTextColor: '#748ffc',
  linkColor: '#91a7ff',

});

export const pinkTheme = createTheme(theme, {
  bgColor: '#f5f0f3',
  textColor: '#632c3b',

  contentBgColor: '#f5e3ef',
  contentBgHover: '#f5e3ef',
  headerBorderColor: '#ffdeeb',
  borderColor: '#af4670',
  shadowColor: '#868e96',
  infoTextColor: '#d6336c',

  codeBlockBgColor: '#ffdeeb',
  codeBlockTextColor: '#a61e4d',
  accentBgColor: '#ffdeeb',
  accentBgHover: '#fcc2d7',
  accentTextColor: '#c2255c',
  lightAccentTextColor: '#f06595',
  linkColor: '#d6336c',
});

/* inspired from Kuromi color palettes
https://www.color-hex.com/color-palette/1022257
https://www.color-hex.com/color-palette/95814
and vscode light pink theme - dark pink
*/
export const darkPinkTheme = createTheme(theme, {
  bgColor: '#252526',
  textColor: '#ffdeeb',

  contentBgColor: '#343a40',
  contentBgHover: '#343a40',
  headerBorderColor: '#565656',
  borderColor: '#FFD6CD',
  shadowColor: '#868e96',
  infoTextColor: '#c097cf',

  codeBlockBgColor: '#8260a2',
  codeBlockTextColor: '#f3f0ff',
  accentBgColor: '#845ef7',
  accentBgHover: '#5f3dc4',
  accentTextColor: '#e5dbff',
  lightAccentTextColor: '#9775fa',
  linkColor: '#b197fc',
});

// code syntax highlighting
// globalStyle(`${lightTheme} code, ${lightTheme} code span`, {
//   color: 'var(--shiki-light)',
// });

// globalStyle(`${darkTheme} code, ${darkTheme} code span`, {
//   color: 'var(--shiki-dark)',
// });

// globalStyle(`${pinkTheme} code, ${pinkTheme} code span`, {
//   color: 'var(--shiki-pink)',
// });

// globalStyle(`${darkPinkTheme} code, ${darkPinkTheme} code span`, {
//   color: 'var(--shiki-darkPink)',
// });

export const themeColor = { ...globalVars, ...theme };
