import { globalStyle } from '@vanilla-extract/css';

import { pinkTheme } from '../theme.css';

/*
Panda Syntax Light theme from highlight.js
Based on: https://github.com/highlightjs/highlight.js/blob/main/src/styles/panda-syntax-light.css
https://github.com/PandaTheme
*/

// Code syntax highlighting
globalStyle(`
  ${pinkTheme} .hljs`,
{
  color: '#2a2c2d',
});

globalStyle(`
  ${pinkTheme} .hljs-comment, 
  ${pinkTheme} .hljs-quote`,
{
  color: '#676B79',
  fontStyle: 'italic',
});

globalStyle(`
  ${pinkTheme} .hljs-emphasis`,
{
  fontStyle: 'italic',
});

globalStyle(`
  ${pinkTheme} .hljs-strong`,
{
  fontWeight: 'bold',
});

globalStyle(`
  ${pinkTheme} .hljs-link`,
{
  textDecoration: 'underline',
});

globalStyle(`${pinkTheme} .hljs-params`, {
  color: '#676B79',
});

globalStyle(`${pinkTheme} .hljs-punctuation, ${pinkTheme} .hljs-attr`, {
  color: '#8e44ad',
});

globalStyle(`${pinkTheme} .hljs-selector-tag, ${pinkTheme} .hljs-name, ${pinkTheme} .hljs-meta, ${pinkTheme} .hljs-operator, ${pinkTheme} .hljs-char.escape_`, {
  color: '#c56200',
});

globalStyle(`${pinkTheme} .hljs-keyword, ${pinkTheme} .hljs-deletion`, {
  color: '#d92792',
});

globalStyle(`${pinkTheme} .hljs-regexp, ${pinkTheme} .hljs-selector-pseudo, ${pinkTheme} .hljs-selector-attr, ${pinkTheme} .hljs-variable.language_`, {
  color: '#cc5e91',
});

globalStyle(`${pinkTheme} .hljs-subst, ${pinkTheme} .hljs-property, ${pinkTheme} .hljs-code, ${pinkTheme} .hljs-formula, ${pinkTheme} .hljs-section, ${pinkTheme} .hljs-title.function_`, {
  color: '#3787c7',
});

globalStyle(`${pinkTheme} .hljs-string, ${pinkTheme} .hljs-symbol, ${pinkTheme} .hljs-bullet, ${pinkTheme} .hljs-addition, ${pinkTheme} .hljs-selector-class, ${pinkTheme} .hljs-title.class_, ${pinkTheme} .hljs-title.class_.inherited__, ${pinkTheme} .hljs-meta .hljs-string`, {
  color: '#0d7d6c',
});

globalStyle(`${pinkTheme} .hljs-variable, ${pinkTheme} .hljs-template-variable, ${pinkTheme} .hljs-number, ${pinkTheme} .hljs-literal, ${pinkTheme} .hljs-link, ${pinkTheme} .hljs-built_in, ${pinkTheme} .hljs-title, ${pinkTheme} .hljs-selector-id, ${pinkTheme} .hljs-tag, ${pinkTheme} .hljs-doctag, ${pinkTheme} .hljs-attribute, ${pinkTheme} .hljs-template-tag, ${pinkTheme} .hljs-meta .hljs-keyword`, {
  color: '#7641bb',
});

globalStyle(`${pinkTheme} .hljs-type`, {
  color: '#d73a49',
});
