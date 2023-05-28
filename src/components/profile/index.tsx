import Image from 'next/image';
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

function Profile() {
  return (
    <article className={styles.profile}>
      <Image 
        className={styles.image} 
        src={blogConfig.picture} 
        alt={`${blogConfig.name}의 프로필 사진`} 
        width={100} 
        height={100} 
      />
      <Intro />
    </article>
  );
}

export default Profile;