import Image from 'next/image';

import blogConfig from 'blog-config';

import Intro from './intro';
import styles from './styles.module.css';


function Profile() {
  return (
    <article className={styles.profile}>
      <Image 
        className={styles.image} 
        src={blogConfig.picture} 
        alt={`${blogConfig.name}의 프로필 사진`} 
        width={100}
        height={100}
        sizes='100px'
      />
      <Intro />
    </article>
  );
}

export default Profile;