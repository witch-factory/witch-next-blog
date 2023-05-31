import styles from './styles.module.css';
import TOCLink from './tocLink';

interface ContentType{
  data: {
    hProperties: {
      id: string;
      title: string;
    }
  };
  depth: number;
  children: ContentType[];
}

function renderContent(nodes: ContentType[]) {
  return (
    <ul className={`${styles.list} ${nodes[0].depth-1?'':styles.list__h1}`}>
      {nodes.map((node: ContentType) => (
        <li key={node.data.hProperties.id} className={styles.item}>
          <TOCLink node={node} />
          {node.children.length>0 && renderContent(node.children)}
        </li>
      ))}
    </ul>
  );
}

function TableOfContents({nodes}: {nodes: ContentType[]}) {
  if (!nodes.length) return null;
  return (
    <section className={styles.container}>
      <span className={styles.title}>목차</span>
      {renderContent(nodes)}
    </section>
  );
}

export default TableOfContents;