'use client';

import ThemeSwitch from '@/components/molecules/themeSwitch';

import HeaderTemplate from './template';

interface PropsItem{
  title: string;
  url: string;
}
/* themeChange 제대로 안되면 use client 쓰기 */
function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <HeaderTemplate navList={navList}>
      <ThemeSwitch />
    </HeaderTemplate>
  );
}

export default Header;