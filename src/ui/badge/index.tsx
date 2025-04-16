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

  return (
    <Component
      {...props}
      className={badge(props)}
    >
      {children}
    </Component>
  );
}
