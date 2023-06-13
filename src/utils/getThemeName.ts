export const getThemeName = (theme: string | undefined) => {
  if (theme === 'witch') {
    return 'dark';
  }
  return theme ?? 'light';
};