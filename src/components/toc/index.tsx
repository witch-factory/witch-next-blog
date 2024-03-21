import { headingData } from '@/utils/post';

import styles from './styles.module.css';
import TOCLink from './tocLink';


function TOC({ nodes }: { nodes: headingData[] }) {
  return (
    <ul
      className={`${styles.list}`}
    >
      {nodes.map((node: headingData) => (
        <li key={node.url} className={styles.item}>
          <TOCLink node={node} />
          {node.items.length > 0 && <TOC nodes={node.items} />}
        </li>
      ))}
    </ul>
  );
}

function TableOfContents({ nodes }: { nodes: headingData[] }) {
  if (!nodes.length) return null;
  return (
    <section className={styles.container}>
      <span className={styles.title}>목차</span>
      <TOC nodes={nodes} />
    </section>
  );
}

export default TableOfContents;
