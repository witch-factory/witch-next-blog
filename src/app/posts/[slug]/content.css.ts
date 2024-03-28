import { globalStyle, style } from '@vanilla-extract/css';

import { themeColor } from '@/styles/theme.css';

export const content = style({
  margin: '0 auto',
  width: '100%',
  minHeight: '100vh',
  wordBreak: 'keep-all',
});

globalStyle(`${content} h1`, {
  margin: '2rem 0 1.25rem 0',
  paddingBottom: '0.25rem',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  fontWeight: 600,
});

globalStyle(`${content} h1 a`, {
  borderBottom: 'none',
});

globalStyle(`${content} h2`, {
  margin: '1.5rem 0 1rem 0',
  paddingBottom: '0.25rem',
  borderBottom: `1px solid ${themeColor.borderColor}`,
});

globalStyle(`${content} h2 a`, {
  borderBottom: 'none',
});

globalStyle(`${content} h3`, {
  paddingBottom: '0.25rem',
  borderBottom: `1px solid ${themeColor.borderColor}`,
});

globalStyle(`${content} :is(h2, h3, h4, h5, h6)`, {
  fontWeight: 500,
});

globalStyle(`${content} :is(h1, h2, h3, h4, h5, h6)`, {
  scrollMarginTop: '50px',
});

globalStyle(`${content} a`, {
  borderBottom: `1px solid ${themeColor.linkColor}`,
  color: themeColor.linkColor,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
});

globalStyle(`${content} pre code`, {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
});

globalStyle(`${content} :is(pre, code)`, {
  fontFamily: 'Fira Code, Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
  direction: 'ltr',
  textAlign: 'left',
  whiteSpace: 'pre',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  lineHeight: 1.5,
  MozTabSize: 4,
  OTabSize: 4,
  tabSize: 4,
  WebkitHyphens: 'none',
  MozHyphens: 'none',
  msHyphens: 'none',
  hyphens: 'none',
  // 점 병합에 관한 옵션
  fontVariantLigatures: 'none',
  fontSize: '1rem',
  overflow: 'auto',
});

globalStyle(`${content} pre`, {
  margin: '1rem 0',
  padding: '1rem',
  borderRadius: '0.5rem',
  backgroundColor: themeColor.contentBgColor,
  lineHeight: 1.5,
});

globalStyle(`${content} :not(pre) > code`, {
  padding: '0.25rem',
  borderRadius: '0.25rem',
  backgroundColor: themeColor.codeBlockBgColor,
  color: themeColor.codeBlockTextColor,
});

globalStyle(`${content} img`, {
  display: 'block',
  margin: '0 auto',
  maxWidth: '92%',
  padding: '1rem 0',
});

globalStyle(`${content} blockquote`, {
  borderLeft: `2px solid ${themeColor.borderColor}`,
  paddingLeft: '1rem',
  color: themeColor.infoTextColor,
});

globalStyle(`${content} p`, {
  lineHeight: 1.625,
  marginBottom: '1.25rem',
});

globalStyle(`${content} li`, {
  lineHeight: 1.5,
  margin: '0.5rem 0',
});

globalStyle(`${content} p code`, {
  whiteSpace: 'pre-wrap',
});

globalStyle(`${content} hr`, {
  border: 0,
  borderTop: `1px solid ${themeColor.borderColor}`,
  margin: '0.5rem 0',
});

globalStyle(`${content} span[aria-hidden="true"]`, {
  display: 'none',
});

globalStyle(`${content} :is(ul, ol)`, {
  paddingLeft: '1.5rem',
});