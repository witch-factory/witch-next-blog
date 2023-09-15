import styles from './styles.module.css';

function LinkList({ children }: {children: React.ReactNode}) {
  return (
    <ul className={styles.linklist}>
      {children}
    </ul>
  );
}

export default LinkList;