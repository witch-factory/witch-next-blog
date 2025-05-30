import { pick } from '@/utils/core/object';

import { badge, BadgeVariants } from './styles.css';

type BadgeProps<C extends React.ElementType = 'span'> = {
  as?: C,
  children: React.ReactNode,
} & BadgeVariants &
Omit<React.ComponentPropsWithoutRef<C>, 'as' | 'children'>;

export default function Badge<C extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: BadgeProps<C>) {
  const Component = as ?? 'span';
  const cssProps = pick(props, [
    'size',
    'color',
    'hover',
    'radius',
  ]);
  return (
    <Component
      {...props}
      className={badge(cssProps)}
    >
      {children}
    </Component>
  );
}
