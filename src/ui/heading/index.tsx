import { pick } from '@/utils/core/object';

import { heading, HeadingVariants } from './styles.css';

type HeadingProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: React.ReactNode,
} & HeadingVariants;

export default function Heading({
  as,
  children,
  ...props
}: HeadingProps) {
  const Component = as;
  const headingProps = pick(props, ['size']);

  return (
    <Component
      {...props}
      className={heading(headingProps)}
    >
      {children}
    </Component>
  );
}
