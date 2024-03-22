'use client';

import { TocEntry } from '@/types/components';

import styles from './styles.module.css';


function TOCLink({ node }: {node: TocEntry}) {
  return (
    <a
      className={styles.link}
      href={`#${node.url}`}
    >
      {node.title}
    </a>
  );
}

export default TOCLink;