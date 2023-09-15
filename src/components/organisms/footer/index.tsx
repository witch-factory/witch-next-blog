import Link from 'next/link';

import Copyright from '@/components/atoms/copyright';
import BlogSymbol from '@/components/molecules/blogSymbol';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div>
            <BlogSymbol />
            <Copyright name={blogConfig.name} url='https://github.com/witch-factory/witch-next-blog' />
          </div>
          <div>
            <p>
              <span>Profile image & witch theme color by <Link target='_blank' href='https://github.com/FairyGina'>Gina Kim</Link></span>
            </p>
            <p>
              <Link target='_blank' href='https://icons8.com/icon/132/search'>Search, </Link> 
              <Link target='_blank' href='https://icons8.com/icon/3096/menu'>Hamburger, </Link>
              <Link target='_blank' href='https://icons8.com/icon/46/close'>Cancel, </Link>
              <Link target='_blank' href='https://icons8.com/icon/92/link'>Link, </Link>
              <Link target='_blank' href='https://icons8.com/icon/26031/moon-symbol'>Moon, </Link>
              <Link target='_blank' href='https://icons8.com/icon/6Z2mGj6qDVv4/sun'>Sun </Link>
            icon by <Link target='_blank' href='https://icons8.com'>Icons8</Link>
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;