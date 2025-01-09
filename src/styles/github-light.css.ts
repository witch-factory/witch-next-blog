import { globalStyle } from '@vanilla-extract/css';

import { lightTheme } from './theme.css';

/*
GitHub Light theme from highlight.js
https://github.com/highlightjs/highlight.js/blob/main/src/styles/github.css
*/

// code syntax highlighting
globalStyle(`
  ${lightTheme} .hljs`,
{
  color: '#24292e',
});

globalStyle(`
  ${lightTheme} .hljs-doctag, 
  ${lightTheme} .hljs-keyword, 
  ${lightTheme} .hljs-meta .hljs-keyword, 
  ${lightTheme} .hljs-template-tag, 
  ${lightTheme} .hljs-template-variable, 
  ${lightTheme} .hljs-type, 
  ${lightTheme} .hljs-variable.language_`,
{
  color: '#d73a49',
});

globalStyle(`
  ${lightTheme} .hljs-title,
  ${lightTheme} .hljs-title.class_, 
  ${lightTheme} .hljs-title.class_.inherited__,
  ${lightTheme} .hljs-title.function_`,
{
  color: '#6f42c1',
});

globalStyle(`
  ${lightTheme} .hljs-attr, 
  ${lightTheme} .hljs-attribute, 
  ${lightTheme} .hljs-literal, 
  ${lightTheme} .hljs-meta, 
  ${lightTheme} .hljs-number, 
  ${lightTheme} .hljs-operator, 
  ${lightTheme} .hljs-variable, 
  ${lightTheme} .hljs-selector-attr, 
  ${lightTheme} .hljs-selector-class, 
  ${lightTheme} .hljs-selector-id`,
{
  color: '#005cc5',
});

globalStyle(`
  ${lightTheme} .hljs-regexp, 
  ${lightTheme} .hljs-string, 
  ${lightTheme} .hljs-meta .hljs-string`,
{
  color: '#032f62',
});

globalStyle(`
  ${lightTheme} .hljs-built_in, 
  ${lightTheme} .hljs-symbol`,
{
  color: '#e36209',
});

globalStyle(`
  ${lightTheme} .hljs-comment, 
  ${lightTheme} .hljs-code, 
  ${lightTheme} .hljs-formula`,
{
  color: '#6a737d',
});

globalStyle(`
  ${lightTheme} .hljs-name, 
  ${lightTheme} .hljs-quote, 
  ${lightTheme} .hljs-selector-tag, 
  ${lightTheme} .hljs-selector-pseudo`,
{
  color: '#22863a',
});

globalStyle(`
  ${lightTheme} .hljs-subst`,
{
  color: '#24292e',
});

globalStyle(
  `${lightTheme} .hljs-section`,
  {
    color: '#005cc5',
    fontWeight: 'bold',
  });

globalStyle(`
  ${lightTheme} .hljs-bullet`,
{
  color: '#735c0f',
});

globalStyle(`
  ${lightTheme} .hljs-emphasis`,
{
  color: '#24292e',
  fontStyle: 'italic',
});

globalStyle(`
  ${lightTheme} .hljs-strong`,
{
  color: '#24292e',
  fontWeight: 'bold',
});

globalStyle(`
  ${lightTheme} .hljs-addition`,
{
  color: '#22863a',
  backgroundColor: '#f0fff4',
});

globalStyle(`
  ${lightTheme} .hljs-deletion`,
{
  color: '#b31d28',
  backgroundColor: '#ffeef0',
});
