'use client';

import ThemeSwitch from '@/components/themeSwitch';
import { BlogCategoryType } from '@/types/config';

import HeaderTemplate from './headerTemplate';

// themeChange 제대로 안되면 use client 쓰기
function Header({
  blogCategoryList,
}: {
  blogCategoryList: BlogCategoryType[],
}) {
  return (
    <HeaderTemplate blogCategoryList={blogCategoryList}>
      <ThemeSwitch />
    </HeaderTemplate>
  );
}

export default Header;
