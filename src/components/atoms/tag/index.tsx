import styles from './styles.module.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

function Tag({ children }: React.PropsWithChildren<Props>) {
  return (
    <li className={styles.tag}>
      {children}
    </li>
  );
}

export default Tag;