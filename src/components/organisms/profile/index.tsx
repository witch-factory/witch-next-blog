import Image from 'next/image';

import Description from '@/components/atoms/description';
import IntroLink from '@/components/atoms/introLink';
import Title from '@/components/atoms/title';
import LinkList from '@/components/templates/linkList';
import blogConfig from 'blog-config';

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
        <Title heading='h2' className='title-md my-2'>{blogConfig.name}</Title>
        <Description className='my-2'>{blogConfig.description}</Description>
        <LinkList>
          {Object.entries(blogConfig.social).map(([key, value]) => (
            <li key={key} className={styles.linkbox}>
              <IntroLink siteLink={value} >
                {key}
              </IntroLink>
            </li>
          ))}
        </LinkList>

      </div>
    </article>
  );
}

export default Profile;