import styles from './styles.module.css';

function PageContainer({children}: React.PropsWithChildren<{}>) {
  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {children}
      </div>
    </main>
  );
}

export default PageContainer;