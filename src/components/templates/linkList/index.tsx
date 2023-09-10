import styles from './styles.module.css';

function LinkList({ children }: React.PropsWithChildren<{}>) {
  return (
    <ul className={styles.linklist}>
      {children}
    </ul>
  );
}

export default LinkList;