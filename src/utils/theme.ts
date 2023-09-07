export type ThemeType = 'light' | 'dark' | 'pink' | 'witch';


export const getThemeName = (theme: string | undefined): ThemeType => {
  if (theme === 'dark' || theme === 'light' || theme === 'pink' || theme === 'witch') {
    return theme;
  }
  return 'light';
};