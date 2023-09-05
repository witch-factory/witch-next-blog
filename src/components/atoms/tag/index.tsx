import styles from './styles.module.css';

interface Props {
  size: 'sm' | 'md' | 'lg';
}

function Tag({ size, children }: React.PropsWithChildren<Props>) {
  return (
    <li className={styles[size]}>
      {children}
    </li>
  );
}

export default Tag;