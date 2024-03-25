import styles from './styles.module.css';

function PageContainer({
  children,
}: {children: React.ReactNode}) {
  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {children}
      </div>
    </main>
  );
}

export default PageContainer;