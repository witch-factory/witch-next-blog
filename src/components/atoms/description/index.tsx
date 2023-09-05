import styles from './styles.module.css';

function Description({ children }: React.PropsWithChildren<{}>) {
  return (
    <p className={styles.description}>
      {children}
    </p>
  );
}

export default Description;