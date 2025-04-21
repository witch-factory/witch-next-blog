import { globalStyle } from '@vanilla-extract/css';

import { darkPinkTheme } from '../theme.css';

/*
Panda Syntax Dark theme from highlight.js
Based on: https://github.com/highlightjs/highlight.js/blob/main/src/styles/panda-syntax-dark.css
*/

// Code syntax highlighting
globalStyle(`${darkPinkTheme} .hljs`, {
  color: '#e6e6e6',
});

globalStyle(`${darkPinkTheme} .hljs-comment, ${darkPinkTheme} .hljs-quote`, {
  color: '#bbbbbb',
  fontStyle: 'italic',
});

globalStyle(`${darkPinkTheme} .hljs-emphasis`, {
  fontStyle: 'italic',
});

globalStyle(`${darkPinkTheme} .hljs-strong`, {
  fontWeight: 'bold',
});

globalStyle(`${darkPinkTheme} .hljs-link`, {
  textDecoration: 'underline',
});

globalStyle(`${darkPinkTheme} .hljs-params`, {
  color: '#bbbbbb',
});

globalStyle(`${darkPinkTheme} .hljs-punctuation, ${darkPinkTheme} .hljs-attr`, {
  color: '#ffcb6b',
});

globalStyle(`${darkPinkTheme} .hljs-selector-tag, ${darkPinkTheme} .hljs-name, ${darkPinkTheme} .hljs-meta`, {
  color: '#ff4b82',
});

globalStyle(`${darkPinkTheme} .hljs-operator, ${darkPinkTheme} .hljs-char.escape_`, {
  color: '#b084eb',
});

globalStyle(`${darkPinkTheme} .hljs-keyword, ${darkPinkTheme} .hljs-deletion`, {
  color: '#ff75b5',
});

globalStyle(`${darkPinkTheme} .hljs-regexp, ${darkPinkTheme} .hljs-selector-pseudo, ${darkPinkTheme} .hljs-selector-attr, ${darkPinkTheme} .hljs-variable.language_`, {
  color: '#ff9ac1',
});

globalStyle(`${darkPinkTheme} .hljs-subst, ${darkPinkTheme} .hljs-property, ${darkPinkTheme} .hljs-code, ${darkPinkTheme} .hljs-formula, ${darkPinkTheme} .hljs-section, ${darkPinkTheme} .hljs-title.function_`, {
  color: '#45a9f9',
});

globalStyle(`${darkPinkTheme} .hljs-string, ${darkPinkTheme} .hljs-symbol, ${darkPinkTheme} .hljs-bullet, ${darkPinkTheme} .hljs-addition, ${darkPinkTheme} .hljs-selector-class, ${darkPinkTheme} .hljs-title.class_, ${darkPinkTheme} .hljs-title.class_.inherited__, ${darkPinkTheme} .hljs-meta .hljs-string`, {
  color: '#19f9d8',
});

globalStyle(`${darkPinkTheme} .hljs-variable, ${darkPinkTheme} .hljs-template-variable, ${darkPinkTheme} .hljs-number, ${darkPinkTheme} .hljs-literal, ${darkPinkTheme} .hljs-link, ${darkPinkTheme} .hljs-built_in, ${darkPinkTheme} .hljs-title, ${darkPinkTheme} .hljs-selector-id, ${darkPinkTheme} .hljs-tag, ${darkPinkTheme} .hljs-doctag, ${darkPinkTheme} .hljs-attribute, ${darkPinkTheme} .hljs-template-tag, ${darkPinkTheme} .hljs-meta .hljs-keyword, ${darkPinkTheme} .hljs-punctuation`, {
  color: '#ffb86c',
});

globalStyle(`${darkPinkTheme} .hljs-type`, {
  color: '#bd93f9',
});
