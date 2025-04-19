import { flex, FlexVariants } from './styles.css';

type FlexProps = {
  children: React.ReactNode,
  className?: string,
} & FlexVariants;

export default function Flex({
  children,
  className,
  ...props
}: FlexProps) {
  return (
    <div className={`${flex(props)} ${className ?? ''}`}>
      {children}
    </div>
  );
}
