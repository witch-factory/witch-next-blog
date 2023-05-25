import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Profile() {
  return (
    <article className={styles.profile}>
      <Image className={styles.profile__image} src={blogConfig.picture} alt={`${blogConfig.name}의 프로필 사진`} width={80} height={80} />
      <div>
        <h2>{blogConfig.name}</h2>
        <p>{blogConfig.description}</p>
        <ul className={styles.profile__linklist}>
          <li>
            <Link href={blogConfig.social.github} target='_blank'>
            Github
            </Link>
          </li>
          <li>
            <Link href={blogConfig.social.BOJ} target='_blank'>
            BOJ
            </Link>
          </li>
        </ul>
      </div>
    </article>
  );
}

export default Profile;