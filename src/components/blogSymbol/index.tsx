import Image from 'next/image';
import Link from 'next/link';

import * as styles from './styles.css';

function BlogSymbol() {
  return (
    <Link href="/" aria-label="Home" className={styles.linkContainer}>
      <div className={styles.container}>
        <Image
          className={styles.logo}
          src="/witch-new-hat.svg"
          alt="logo"
          width={50}
          height={50}
          placeholder="empty"
        />
        <h1 className={styles.title}>
          <span>Witch</span>
          <span className={styles.url}>-Work</span>
        </h1>
      </div>
    </Link>
  );
}

export default BlogSymbol;
