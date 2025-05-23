import { pick } from '@/utils/core/object';

import { text, TextVariants } from './styles.css';

type TextProps = {
  as?: 'span' | 'div' | 'label' | 'p',
  children: React.ReactNode,
} & TextVariants;

export default function Text({
  as: Component = 'span',
  children,
  ...props
}: TextProps) {
  const textProps = pick(props, ['size', 'color', 'weight', 'decoration']);
  return (
    <Component
      {...props}
      className={text(textProps)} // Use the text recipe to apply styles
    >
      {children}
    </Component>
  );
}
