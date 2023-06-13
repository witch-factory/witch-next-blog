import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  const { setTheme } = useTheme();

  const pinkTheme = () => {
    setTheme('pink');
  };

  const witchTheme = () => {
    setTheme('witch');
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <p className={styles.copyright}>
          © {blogConfig.name}, Built with
            <Link href='https://github.com/witch-factory/witch-next-blog' target='_blank'> witch-next-blog</Link>, 
          2023
          </p>
          <Link href='https://github.com/witch-factory' className={styles.github}>
            <Image src='/github-mark.png' alt='Github' width={32} height={32} />
          </Link>
          <p>
            <Link target='_blank' href='https://icons8.com/icon/132/search'>Search, </Link> 
            <Link target='_blank' href='https://icons8.com/icon/3096/menu'>Hamburger, </Link>
            <Link target='_blank' href='https://icons8.com/icon/46/close'>Cancel, </Link>
            <Link target='_blank' href='https://icons8.com/icon/92/link'>Link, </Link>
            icon by <Link target='_blank' href='https://icons8.com'>Icons8</Link>
          </p>
          <div className={styles.theme}>
            <p>Experimental Color Theme Changer</p>
            <div className={styles.buttonContainer}>
              <button 
                className={styles.pinkTheme}
                onClick={pinkTheme}
                aria-label='pink theme button'
              ></button>
              <button 
                className={styles.witchTheme}
                onClick={witchTheme}
                aria-label='witch theme button'
              >WITCH</button>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;