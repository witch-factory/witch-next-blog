import Image from 'next/image';
import { useTheme } from 'next-themes';

import { ThemeType, getThemeName } from '@/utils/theme';

interface Props {
  iconSrcMap: Record<ThemeType, string>;
  imageAlt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

function Icon({ iconSrcMap, imageAlt, width = 20, height = 20, priority }: Props) {
  const { theme } = useTheme();
  return (
    <Image
      src={iconSrcMap[getThemeName(theme)]}
      alt={imageAlt}
      width={width}
      height={height}
      priority={priority}
    />
  );
}

export default Icon;