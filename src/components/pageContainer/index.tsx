import styles from './styles.module.css';

type PageType='main'|'post';

function PageContainer({
  children,
  pageType='main'
}: React.PropsWithChildren<{pageType?: PageType}>) {
  return (
    <main className={`${styles.container} ${styles[pageType]}`}>
      <div className={styles.inner}>
        {children}
      </div>
    </main>
  );
}

export default PageContainer;