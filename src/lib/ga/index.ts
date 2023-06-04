import blogConfig from 'blog-config';

declare global {
  interface Window {
    gtag: (param1: string, param2: string, param3: object) => void;
  }
}
​
export const pageview = (url: string) => {
  if (!blogConfig.googleAnalyticsId) return;
  window.gtag('config', blogConfig.googleAnalyticsId, {
    page_path: url,
  });
};