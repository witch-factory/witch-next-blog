import styles from './styles.module.css';

interface Props {
  type: 'lg' | 'md' | 'sm';
}

const headingMap = {
  lg: 'h1',
  md: 'h2',
  sm: 'h3',
} as const;

function Title({ type, children }: React.PropsWithChildren<Props>) {
  const Heading=headingMap[type];
  return (
    <Heading className={styles[type]}>
      {children}
    </Heading>
  );
}

export default Title;