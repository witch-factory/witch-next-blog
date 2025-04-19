import { BlogCategoryType } from '@/types/config';
import { Locale } from '@/types/i18n';

import HeaderTemplate from './headerTemplate';
import ThemeSwitch from './ThemeSwitch';

// themeChange 제대로 안되면 use client 쓰기
function Header({
  lang,
  blogCategoryList,
}: {
  lang: Locale,
  blogCategoryList: BlogCategoryType[],
}) {
  return (
    <HeaderTemplate lang={lang} blogCategoryList={blogCategoryList}>
      <ThemeSwitch />
    </HeaderTemplate>
  );
}

export default Header;
