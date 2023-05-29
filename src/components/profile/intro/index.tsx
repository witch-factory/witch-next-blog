import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';


function Intro() {
  return (
    <div>
      <h2 className={styles.name}>{blogConfig.name}</h2>
      <p className={styles.description}>{blogConfig.description}</p>
      <ul className={styles.linklist}>
        {Object.entries(blogConfig.social).map(([key, value]) => (
          <li key={key}>
            <Link href={value} target='_blank' className={styles.link}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Intro;