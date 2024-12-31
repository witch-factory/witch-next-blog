import Image from 'next/image';

import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';

import ProfileLinkList from './linkList';
import * as styles from './styles.css';

function Profile({ lang }: { lang: Language }) {
  return (
    <article className={styles.profile}>
      <Image
        className={styles.image}
        src={blogConfig[lang].picture}
        alt={
          lang === 'ko' ? `${blogConfig.ko.name}의 프로필 사진` : `${blogConfig.en.name} profile picture`
        }
        width={100}
        height={100}
        placeholder={blogConfig[lang].pictureBlur ? 'blur' : 'empty'}
        blurDataURL={blogConfig[lang].pictureBlur}
        sizes="100px"
      />
      <div>
        <h2 className={styles.title}>{blogConfig[lang].name}</h2>
        <p className={styles.description}>{blogConfig[lang].description}</p>
        <ProfileLinkList linkList={Object.entries(blogConfig[lang].social).map((value) => {
          return { siteName: value[0], siteLink: value[1] };
        })}
        />
      </div>
    </article>
  );
}

export default Profile;
