import { enPostTags, postTags } from '#site/content';
import Flex from '@/containers/flex';
import TagGroup from '@/modules/tagGroup';
import { assertValidLocale } from '@/utils/core/string';

const tagsMap = {
  ko: postTags,
  en: enPostTags,
};

function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]/posts/tag/[tag]'>) {
  const { tag, lang } = (await params);
  assertValidLocale(lang);

  return (
    <Flex direction="column" justify="center" gap="lg">
      <TagGroup title={`${lang === 'ko' ? '태그' : 'Tag'} : ${capitalize(tag)}`} selectedTagSlug={tag} tags={tagsMap[lang]} />
      {children}
    </Flex>
  );
}

export default Layout;
