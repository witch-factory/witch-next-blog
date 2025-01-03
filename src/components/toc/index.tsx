import { TocEntry } from '@/types/components';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

function TOC({ nodes }: { nodes: TocEntry[] }) {
  return (
    <ul className={styles.list}>
      {nodes.map((node: TocEntry) => (
        <li key={node.url} className={styles.item}>
          <a
            className={styles.link}
            href={node.url}
          >
            {node.title}
          </a>
          {node.items.length > 0 && <TOC nodes={node.items} />}
        </li>
      ))}
    </ul>
  );
}

const content = {
  ko: {
    title: '목차',
  },
  en: {
    title: 'Table of Contents',
  },
} as const satisfies Record<Language, { title: string }>;

function TableOfContents({ lang, nodes }: { lang: Language, nodes: TocEntry[] }) {
  if (!nodes.length) return null;
  return (
    <section className={styles.container}>
      <span className={styles.title}>{content[lang].title}</span>
      <TOC nodes={nodes} />
    </section>
  );
}

export default TableOfContents;
