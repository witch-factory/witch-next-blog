import Image from 'next/image';
import Link from 'next/link';

import Flex from '@/containers/flex';
import List from '@/containers/list';
import { i18n, Locale } from '@/types/i18n';
import Heading from '@/ui/heading';
import Text from '@/ui/text';

import { aboutContent } from './content';
import * as styles from './styles.css';

type Props = {
  params: Promise<{ lang: Locale }>,
};

async function AboutPage({ params }: Props) {
  const { lang } = await params;

  return (
    <Flex gap="lg" direction="column">
      <Heading as="h2" size="lg">
        {aboutContent[lang].name}
      </Heading>
      <List gap="md" direction="row">
        {aboutContent[lang].links.map((link) => (
          <List.Item key={link.name}>
            <Link target="_blank" href={link.url} className={styles.link}>
              {link.name}
            </Link>
          </List.Item>
        ))}
      </List>
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
      <Flex gap="lg" direction="column">
        <Heading as="h2" size="md">
          {aboutContent[lang].interests.title}
        </Heading>
        <Flex gap="md" direction="column">
          <Heading as="h3" size="sm">
            {aboutContent[lang].interests.algorithms.title}
          </Heading>
          <List gap="md" direction="column" listStyle="disc">
            {aboutContent[lang].interests.algorithms.items.map((item) => (
              <List.Item key={item}>{item}</List.Item>
            ))}
            {aboutContent[lang].interests.algorithms.accounts.map((account) => (
              <List.Item key={account.name}>
                {account.name}
                :&nbsp;
                <Link target="_blank" href={account.url} className={styles.link}>
                  {account.url}
                </Link>
              </List.Item>
            ))}
          </List>
        </Flex>
        <Flex gap="md" direction="column">
          <Heading as="h3" size="sm">{aboutContent[lang].interests.javascript.title}</Heading>
          <List gap="md" direction="column" listStyle="disc">
            {aboutContent[lang].interests.javascript.items.map((item) => (
              <List.Item key={item.name}>
                <Link href={item.url} target="_blank" className={styles.link}>
                  {item.name}
                </Link>
              </List.Item>
            ))}
          </List>
        </Flex>
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
