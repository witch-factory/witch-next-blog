import { enPostTags, postTags } from '#site/content';
import { Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import TagGroup from '@/modules/tagGroup';

const tagsMap = {
  ko: postTags,
  en: enPostTags,
};

type Props = {
  params: Promise<{
    tag: string,
    lang: Locale,
  }>,
  children: React.ReactNode,
};

function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function Layout({
  params,
  children,
}: Props) {
  const { tag, lang } = await params;

  return (
    <Flex direction="column" justify="center" gap="lg">
      <TagGroup title={`${lang === 'ko' ? '태그' : 'Tag'} : ${capitalize(tag)}`} selectedTagSlug={tag} tags={tagsMap[lang]} />
      {children}
    </Flex>
  );
}

export default Layout;
