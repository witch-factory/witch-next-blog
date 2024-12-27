import { blogConfig } from '@/config/blogConfig';

export const pageview = (url) => {
  if (!blogConfig.googleAnalyticsId) {
    return;
  }
  window.gtag('config', blogConfig.googleAnalyticsId, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
