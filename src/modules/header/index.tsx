import { Locale } from '@/types/i18n';

import HeaderTemplate from './headerTemplate';
import ThemeSwitch from './ThemeSwitch';

// themeChange 제대로 안되면 use client 쓰기
function Header({
  lang,
}: {
  lang: Locale,
}) {
  return (
    <HeaderTemplate lang={lang}>
      <ThemeSwitch />
    </HeaderTemplate>
  );
}

export default Header;
