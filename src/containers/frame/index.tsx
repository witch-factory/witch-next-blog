import * as styles from './styles.css';

function Frame({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {children}
      </div>
    </main>
  );
}

export default Frame;
