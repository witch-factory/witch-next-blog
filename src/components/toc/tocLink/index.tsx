'use client';

import { headingData } from '@/utils/post';

import styles from './styles.module.css';


function TOCLink({ node }: {node: headingData}) {
  return (
    <a
      className={styles.link}
      href={`#${node.data.hProperties.id}`}
    >
      {node.data.hProperties.title}
    </a>
  );
}

export default TOCLink;