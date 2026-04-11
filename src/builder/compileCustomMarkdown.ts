import { Context, Meta } from '@content-collections/core';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import lisp from 'highlight.js/lib/languages/lisp';
import nginx from 'highlight.js/lib/languages/nginx';
import { common } from 'lowlight';
import type { Root as Mdast } from 'mdast';
import rehypeHighlight, { type Options as RehypeHighlightOptions } from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { Transformer, unified } from 'unified';
import { EXIT, visit } from 'unist-util-visit';

import prisma from '@/bin/prisma-highlight';
import { Locale } from '@/constants/i18n';
import remarkHeadingTree from '@/plugins/remark-heading-tree';
import remarkImagePath from '@/plugins/remark-image-path';
import { TocEntry } from '@/types/components';

const rehypeHighlightOptions = {
  languages: {
    ...common,
    lisp,
    nginx,
    dockerfile,
    prisma,
  },
} satisfies RehypeHighlightOptions;

type Document = {
  _meta: Meta,
  content: string,
};

type DocumentKind = Locale | 'translation';
const MARKDOWN_PIPELINE_VERSION = '2026-04-11-static-asset-path-v1';

function addMetaToVFile(_meta: Meta) {
  return (): Transformer => (_, vFile) => {
    Object.assign(vFile.data, { _meta });
  };
}

function captureFirstImageUrl() {
  return (tree: Mdast, file: { data: Record<string, unknown> }) => {
    let firstImageUrl: string | null = null;

    visit(tree, 'image', (node) => {
      firstImageUrl = node.url;
      return EXIT;
    });

    file.data.firstImageUrl = firstImageUrl;
  };
}

async function compile(document: Document, kind: DocumentKind = 'ko') {
  const builder = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(addMetaToVFile(document._meta))
    .use(captureFirstImageUrl)
    .use(remarkImagePath, kind);

  builder
    .use(remarkHeadingTree)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight, rehypeHighlightOptions)
    .use(rehypeStringify);

  const file = await builder.process(document.content);

  return {
    html: String(file),
    headingTree: (file.data.headingTree as TocEntry[] | undefined) ?? [],
    firstImageUrl: (file.data.firstImageUrl as string | null | undefined) ?? null,
  };
}

// Remove all unnecessary keys from the document
// and return a new object containing only the keys
// that should trigger a regeneration if changed.
function createCacheKey(document: Document): Document {
  const { content, _meta } = document;
  return { content, _meta };
}

export function compileCustomMarkdown(
  { cache }: Pick<Context, 'cache'>,
  document: Document,
  kind: DocumentKind = 'ko',
) {
  const cacheKey = createCacheKey(document);
  return cache({ ...cacheKey, kind, version: MARKDOWN_PIPELINE_VERSION }, (doc) => compile(doc, kind), {
    key: '__markdown',
  });
}
