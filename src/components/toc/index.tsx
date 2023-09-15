import { headingData } from '@/utils/post';

import styles from './styles.module.css';
import TOCLink from './tocLink';


function renderContent(nodes: headingData[]) {
  return (
    <ul className={`${styles.list} ${nodes[0].depth - 1 ? '' : styles.list__h1}`}>
      {nodes.map((node: headingData) => (
        <li key={node.data.hProperties.id} className={styles.item}>
          <TOCLink node={node} />
          {node.children.length > 0 && renderContent(node.children)}
        </li>
      ))}
    </ul>
  );
}

function TableOfContents({ nodes }: {nodes: headingData[]}) {
  if (!nodes.length) return null;
  return (
    <section className={styles.container}>
      <span className={styles.title}>목차</span>
      {renderContent(nodes)}
    </section>
  );
}

export default TableOfContents;