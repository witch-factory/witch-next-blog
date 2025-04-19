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
  return (
    <Component
      {...props}
      className={text(props)}
    >
      {children}
    </Component>
  );
}
