import styles from './styles.module.css';

interface Props {
  heading: 'h1' | 'h2' | 'h3';
  size: 'sm' | 'md' | 'lg';
}

function Title({ heading, size, children }: React.PropsWithChildren<Props>) {
  const Heading = heading;
  return (
    <Heading className={styles[size]}>
      {children}
    </Heading>
  );
}

export default Title;