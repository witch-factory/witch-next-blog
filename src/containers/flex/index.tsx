import { pick } from '@/utils/core/pick';

import { flex, FlexVariants } from './styles.css';

type FlexProps = {
  children: React.ReactNode,
} & FlexVariants;

export default function Flex({
  children,
  ...props
}: FlexProps) {
  const flexProps = pick(props, ['direction', 'align', 'justify', 'wrap', 'gap']);

  return (
    <div {...props} className={flex(flexProps)}>
      {children}
    </div>
  );
}
