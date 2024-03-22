import { TocEntry } from '@/types/components';

import styles from './styles.module.css';
import TOCLink from './tocLink';


function TOC({ nodes }: { nodes: TocEntry[] }) {
  return (
    <ul
      className={`${styles.list}`}
    >
      {nodes.map((node: TocEntry) => (
        <li key={node.url} className={styles.item}>
          <TOCLink node={node} />
          {node.items.length > 0 && <TOC nodes={node.items} />}
        </li>
      ))}
    </ul>
  );
}

function TableOfContents({ nodes }: { nodes: TocEntry[] }) {
  if (!nodes.length) return null;
  return (
    <section className={styles.container}>
      <span className={styles.title}>목차</span>
      <TOC nodes={nodes} />
    </section>
  );
}

export default TableOfContents;
