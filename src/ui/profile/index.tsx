import Image from 'next/image';

import { blogConfig } from '@/config/blogConfig';

import ProfileLinkList from './linkList';
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
      <div>
        <h2 className='title-md my-2'>{blogConfig.name}</h2>
        <p className='description my-2'>{blogConfig.description}</p>
        <ProfileLinkList linkList={Object.entries(blogConfig.social).map((value)=>{
          return { siteName: value[0], siteLink: value[1] };
        })} />
      </div>
    </article>
  );
}

export default Profile;