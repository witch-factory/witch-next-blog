import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';

import HomeButton from '../header/homeButton';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  const { setTheme } = useTheme();

  const changeTheme = useCallback((theme: string) => {
    return ()=>{
      setTheme(theme);
    };
  }, []);


  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div>
            <HomeButton />
            <p className={styles.copyright}>
          © {blogConfig.name},
              <Link href='https://github.com/witch-factory/witch-next-blog' target='_blank'> witch-next-blog</Link>, 
          2023
            </p>
          </div>
          <div>
            <div className={styles.theme}>
              <p>
              Experimental Color Theme Changer
              </p>
            
              <div className={styles.buttonContainer}>
                <button 
                  className={styles.pinkTheme}
                  onClick={changeTheme('pink')}
                  aria-label='pink theme button'
                ></button>
                <button 
                  className={styles.witchTheme}
                  onClick={changeTheme('witch')}
                  aria-label='witch theme button'
                >WITCH</button>
              </div>
              <p>
                <span>Profile image & witch theme color by <Link target='_blank' href='https://github.com/FairyGina'>Gina Kim</Link></span>
              </p>
            </div>
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