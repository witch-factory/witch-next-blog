/*
Language: Prisma
Author: Kim Sung Hyun <soakdma37@gmail.com>
Description: language definition for Prisma schema language
Website: https://www.prisma.io/
Category: database
*/

/** @type LanguageFn */
export default function highlight(hljs) {
  // Prisma 키워드
  const TYPES = [
    'Int',
    'BigInt',
    'String',
    'DateTime',
    'Bytes',
    'Decimal',
    'Float',
    'Json',
    'Boolean',
  ];

  const KEYWORDS = [
    'model',
    'enum',
    'type',
    'datasource',
    'generator',
    'view',
  ];

  const COMMENTS = {
    scope: 'comment',
    variants: [
      hljs.COMMENT('///', '$'),
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      // double_comment_inline
      {
        match: /\/\/[^\n]*/,
      },
    ],
  };

  const LITERAL_VALUE = {
    scope: 'literal',
    begin: /\$(null|true|false)\b/,
  };

  const NUMBER = {
    scope: 'number',
    match: /((0(x|X)[0-9a-fA-F]*)|(\+|-)?\b(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)([LlFfUuDdg]|UL|ul)?\b/,
  };

  const IDENTIFIER = {
    scope: 'variable',
    match: /\b(\w+)\b/,
  };

  const DOUBLE_QUOTED_STRING = {
    scope: 'string',
    begin: '"',
    end: '"',
    contains: [
      {
        scope: 'subst',
        begin: /\${/,
        beginScope: 'punctuation',
        end: /\s*\}/,
        endScope: 'punctuation',
        keywords: {
          $pattern: /[\w.]+/,
          keyword: KEYWORDS,
          type: TYPES,
        },
        contains: [LITERAL_VALUE, NUMBER, IDENTIFIER],
      },
    ],
  };

  const LITERAL = [LITERAL_VALUE, NUMBER, DOUBLE_QUOTED_STRING];

  const ARRAY = {
    begin: /\[/,
    beginScope: 'punctuation',
    end: /\]/,
    endScope: 'punctuation',
    contains: ['self', ...LITERAL],
  };

  const FUNCTIONAL = {
    begin: [/(\w+)/, /\s*/, /\(/],
    beginScope: {
      1: 'title.function',
      3: 'punctuation',
    },
    end: /\)/,
    endScope: 'punctuation',
    contains: ['self', ...LITERAL],
  };

  const MAP_KEY = {
    scope: 'symbol',
    match: /(\w+)\s*(:)\s*/,
  };

  const VALUE = [LITERAL_VALUE, NUMBER, DOUBLE_QUOTED_STRING, ARRAY, FUNCTIONAL];

  const ATTRIBUTE = {
    scope: 'attr',
    match: /(@@?[\w.]+)/,
  };

  const ATTRIBUTE_WITH_ARGUMENT = {
    begin: [/@@?[\w.]+/, /\s*/, /\(/],
    beginScope: {
      1: 'attribute',
      3: 'punctuation',
    },
    end: /\)/,
    endScope: 'punctuation',
    contains: [MAP_KEY, ...VALUE],
  };

  const ASSIGNMENT = {
    begin: [/\w+/, /\s*/, /(?<!@)=/, /\s*/],
    beginScope: {
      1: 'variable',
      3: 'operator',
    },
    end: /\n/,
    contains: [...VALUE, hljs.C_LINE_COMMENT_MODE],
  };

  const ENUM_VALUE_DEFINITION = {
    scope: 'variable',
    match: /^\s*(\w+)\s*/,
    contains: [ATTRIBUTE_WITH_ARGUMENT, ATTRIBUTE],
  };

  const ENUM_BLOCK_DEFINITION = {
    begin: [
      /(enum)/, // "enum" 키워드 매칭
      /\s+/, // 공백 매칭
      /([A-Za-z][\w]*)/, // 열거형 이름 매칭 (문자로 시작하는 단어)
      /\s+/, // 공백 매칭
      /({)/, // 왼쪽 중괄호 매칭
    ],
    beginScope: {
      1: 'keyword',
      3: 'title.class',
      5: 'punctuation',
    },
    end: /\s*}/,
    endScope: 'punctuation',
    contains: [COMMENTS, ENUM_VALUE_DEFINITION],
  };

  const CONFIG_BLOCK_DEFINITION = {
    begin: [
      /(datasource|generator)/,
      /\s+/,
      /([A-Za-z][\w]*)/,
      /\s+/,
      /({)/,
    ],
    beginScope: {
      1: 'keyword',
      3: 'title.class',
      5: 'punctuation',
    },
    end: /\s*}/,
    endScope: 'punctuation',
    contains: [COMMENTS, ASSIGNMENT],
  };

  const TYPE_DEFINITION = {
    begin: [
      /(type)/,
      /\s+/,
      /\w+/,
      /\s*=\s*/,
      /(\w+)/,
    ],
    beginScope: {
      1: 'keyword',
      3: 'type',
      5: 'title.class',
    },
    end: /\n/,
    contains: [ATTRIBUTE_WITH_ARGUMENT, ATTRIBUTE],
  };

  const FIELD_DEFINITION = {
    begin: [
      /(\w+)/,
      /(\s*:)?/,
      /\s+/,
      /((?!(?:Int|BigInt|String|DateTime|Bytes|Decimal|Float|Json|Boolean)\b)\b\w+)?/,
      /(Int|BigInt|String|DateTime|Bytes|Decimal|Float|Json|Boolean)?/,
      /(\[\])?/,
      /(\?)?/,
      /(!)?/,
    ],
    beginScope: {
      1: 'title',
      4: 'type',
      5: 'type',
      6: 'operator',
      7: 'type',
      8: 'type',
    },
    end: /\n/,
    contains: [ATTRIBUTE_WITH_ARGUMENT, ATTRIBUTE, COMMENTS],
  };

  const MODEL_BLOCK_DEFINITION = {
    begin: [
      /(model|type|view)/,
      /\s+/,
      /([A-Za-z][\w]*)/,
      /\s*/,
      /({)/,
    ],
    beginScope: {
      1: 'keyword',
      3: 'title.class',
      5: 'punctuation',
    },
    end: /\s*}/,
    endScope: 'punctuation',
    contains: [COMMENTS, FIELD_DEFINITION, ATTRIBUTE_WITH_ARGUMENT, ATTRIBUTE],
  };

  return {
    name: 'Prisma schema language',
    case_insensitive: true,
    keywords: {
      keyword: KEYWORDS,
      type: TYPES,
      literal: [
        'true',
        'false',
        'null',
      ],
    },
    contains: [
      COMMENTS,
      MODEL_BLOCK_DEFINITION,
      CONFIG_BLOCK_DEFINITION,
      ENUM_BLOCK_DEFINITION,
      TYPE_DEFINITION,
    ],
  };
}
