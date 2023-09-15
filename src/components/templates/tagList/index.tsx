import styles from './styles.module.css';

interface Props {
  gap?: 'sm' | 'md' | 'lg';
}

function TagList({ children, gap = 'md' }: React.PropsWithChildren<Props>) {
  return (
    <ul className={`${styles.tagList} ${styles[gap]}`}>
      {children}
    </ul>
  );
}

export default TagList;