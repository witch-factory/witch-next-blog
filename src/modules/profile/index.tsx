import Image from 'next/image';
import Link from 'next/link';

import Heading from '../../ui/heading';
import Text from '../../ui/text';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';

import * as styles from './styles.css';

function Profile({ lang }: { lang: Locale }) {
  const linkList = Object.entries(blogConfig.social).map((value) => {
    return { siteName: value[0], siteLink: value[1] };
  });

  return (
    <article className={styles.profile}>
      <Image
        className={styles.image}
        src={blogConfig.picture}
        alt={
          lang === 'ko' ? `${blogLocalConfig.ko.name}의 프로필 사진` : `${blogLocalConfig.en.name} profile picture`
        }
        width={110}
        height={110}
        placeholder={blogConfig.pictureBlur ? 'blur' : 'empty'}
        blurDataURL={blogConfig.pictureBlur}
        sizes="110px"
      />
      <Flex gap="sm" direction="column">
        <Heading as="h2" size="sm">
          {blogLocalConfig[lang].name}
        </Heading>
        <Text as="p" size="md">
          {blogLocalConfig[lang].description}
        </Text>
        <Flex direction="row" gap="lg" wrap="wrap">
          {linkList.map((link) => (
            <Link key={link.siteName} href={link.siteLink} target="_blank" className={styles.link}>
              {link.siteName}
            </Link>
          ))}
        </Flex>
      </Flex>
    </article>
  );
}

export default Profile;
