type ThemeType = 'light' | 'dark' | 'pink' | 'darkPink';

export const getThemeName = (theme: string | undefined): ThemeType => {
  if (
    theme === 'dark' ||
    theme === 'light' ||
    theme === 'pink' ||
    theme === 'darkPink'
  ) {
    return theme;
  }
  return 'light';
};
