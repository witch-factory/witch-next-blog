import { getSearchPosts } from '@/utils/content/postMetadata';
import { assertValidLocale } from '@/utils/core/string';

import SearchPosts from './SearchPosts';

// 클라이언트 컴포넌트에서 콘텐츠 모듈을 import하면 전체 글 html이 번들에 포함되므로 서버에서 필요한 필드만 넘긴다
async function PostSearchPage({ params }: PageProps<'/[lang]/search'>) {
  const { lang } = (await params);
  assertValidLocale(lang);

  return <SearchPosts lang={lang} searchPosts={getSearchPosts(lang)} />;
}

export default PostSearchPage;
