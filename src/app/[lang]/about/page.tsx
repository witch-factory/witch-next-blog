import Image from 'next/image';
import Link from 'next/link';

import { i18n } from '@/constants/i18n';
import Flex from '@/containers/flex';
import Heading from '@/ui/heading';
import Text from '@/ui/text';
import { assertValidLocale } from '@/utils/core/string';

import { aboutContent } from './content';
import * as styles from './styles.css';

async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = (await params);
  assertValidLocale(lang);

  return (
    <Flex gap="lg" direction="column">
      <Heading as="h2" size="lg">
        {aboutContent[lang].name}
      </Heading>
      <Flex gap="lg" direction="row">
        {aboutContent[lang].links.map((link) => (
          <Link key={link.name} target="_blank" href={link.url} className={styles.link}>
            {link.name}
          </Link>
        ))}
      </Flex>
      <Text as="p" size="md">
        {aboutContent[lang].description}
      </Text>
      <Flex gap="xl" direction="row" justify="center" align="center">
        <Image
          width={120}
          height={120}
          style={{ margin: '0 auto' }}
          src="/witch-new-hat.png"
          alt={aboutContent[lang].symbolInfo}
        />
      </Flex>
      <Flex gap="lg" direction="column">
        <Heading as="h2" size="md">
          {aboutContent[lang].introduction.title}
        </Heading>
        {aboutContent[lang].introduction.paragraphs.map((paragraph) => (
          <Text as="p" size="md" key={paragraph}>{paragraph}</Text>
        ))}
      </Flex>
    </Flex>
  );
}

export default AboutPage;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}
