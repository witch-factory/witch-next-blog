'use client';

import ThemeSwitch from '@/components/themeSwitch';
import { BlogCategoryType } from '@/types/config';
import { Language } from '@/types/i18n';

import HeaderTemplate from './headerTemplate';

// themeChange 제대로 안되면 use client 쓰기
function Header({
  lang,
  blogCategoryList,
}: {
  lang: Language,
  blogCategoryList: BlogCategoryType[],
}) {
  return (
    <HeaderTemplate lang={lang} blogCategoryList={blogCategoryList}>
      <ThemeSwitch />
    </HeaderTemplate>
  );
}

export default Header;
