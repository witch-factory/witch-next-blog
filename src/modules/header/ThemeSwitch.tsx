'use client';

import { useTheme } from 'next-themes';

import LightDarkToggle from '../../icons/lightDarkToggleIcon';
import PinkToggle from '../../icons/pinkToggleIcon';
import Flex from '@/containers/flex';
import { getThemeName } from '@/utils/content/theme';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDarkOrPink = getThemeName(theme) === 'dark' || getThemeName(theme) === 'pink';
  const toggleTheme = () => {
    setTheme(isDarkOrPink ? 'light' : 'dark');
  };
  const togglePinkTheme = () => {
    setTheme(isDarkOrPink ? 'darkPink' : 'pink');
  };

  return (
    <Flex direction="row" gap="lg" align="center">
      <LightDarkToggle toggleClick={toggleTheme} />
      <PinkToggle toggleClick={togglePinkTheme} />
    </Flex>
  );
}

export default ThemeSwitch;
