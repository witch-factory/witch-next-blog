import { globalStyle } from '@vanilla-extract/css';

import { themeColor } from './theme.css';

globalStyle(':root', {
  fontFamily: "pretendard, apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  textRendering: 'optimizeSpeed',
});

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html, body', {
  minHeight: '100vh',
  scrollBehavior: 'smooth',
  backgroundColor: themeColor.bgColor,
  color: themeColor.textColor,
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
});

globalStyle('h1', {
  fontSize: '1.75rem',
});

globalStyle('h2', {
  fontSize: '1.5rem',
});

globalStyle('h3', {
  fontSize: '1.25rem',
});

globalStyle('h4', {
  fontSize: '1rem',
});

globalStyle('hr', {
  margin: '0.25rem 0',
  border: 0,
  borderTop: `0.125rem solid ${themeColor.color.gray5}`,
});


globalStyle('img', {
  display: 'block',
  margin: '0 auto',
});

globalStyle('p', {
  margin: '0.75rem 0',
  lineHeight: '1.5rem',
});

globalStyle('table', {
  width: '100%',
  margin: '0.75rem 0',
  borderCollapse: 'collapse',
  lineHeight: '1.75rem',
});

globalStyle('tr', {
  borderBottom: `1px solid ${themeColor.color.gray5}`,
});

globalStyle('th, td', {
  padding: '0.75rem 0',
  textAlign:'center',
});

globalStyle('blockquote', {
  paddingLeft: '1rem',
  borderLeft: `0.25rem solid ${themeColor.color.indigo7}`,
});

globalStyle('article', {
  overflowWrap: 'break-word',
});

globalStyle("pre[class^='language-']", {
  borderRadius: '0.25rem',
});

globalStyle("code[class*='language-']", {
  whiteSpace: 'pre-wrap',
});

globalStyle("pre[class*='language-']", {
  whiteSpace: 'pre-wrap',
});