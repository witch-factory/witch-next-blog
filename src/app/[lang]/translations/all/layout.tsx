import { Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import Heading from '@/ui/heading';
import Text from '@/ui/text';
import { assertValidLocale } from '@/utils/core/string';

const content = {
  ko: {
    title: '번역한 글',
    description: '재미있게 읽은 글들을 한국어로 번역합니다.',
  },
  en: {
    title: 'Translations',
    description: 'I translate articles that I found interesting into Korean.',
  },
} as const satisfies Record<Locale, object>;

async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]/translations/all'>) {
  const { lang } = (await params);
  assertValidLocale(lang);

  return (
    <Flex direction="column" justify="center" gap="lg">
      <Heading as="h2" size="md">
        {content[lang].title}
      </Heading>
      <Text>
        {content[lang].description}
      </Text>
      {children}
    </Flex>
  );
}

export default Layout;
