import Image from 'next/image';

import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/types/i18n';

import ProfileLinkList from './linkList';
import * as styles from './styles.css';

function Profile({ lang }: { lang: Locale }) {
  return (
    <article className={styles.profile}>
      <Image
        className={styles.image}
        src={blogConfig.picture}
        alt={
          lang === 'ko' ? `${blogLocalConfig.ko.name}의 프로필 사진` : `${blogLocalConfig.en.name} profile picture`
        }
        width={100}
        height={100}
        placeholder={blogConfig.pictureBlur ? 'blur' : 'empty'}
        blurDataURL={blogConfig.pictureBlur}
        sizes="100px"
      />
      <div>
        <h2 className={styles.title}>{blogLocalConfig[lang].name}</h2>
        <p className={styles.description}>{blogLocalConfig[lang].description}</p>
        <ProfileLinkList linkList={Object.entries(blogConfig.social).map((value) => {
          return { siteName: value[0], siteLink: value[1] };
        })}
        />
      </div>
    </article>
  );
}

export default Profile;
