import styles from './styles.module.css';

function Description({ children, className }: React.PropsWithChildren<{className?: string}>) {
  return (
    <p className={`${styles.description} ${className}`}>
      {children}
    </p>
  );
}

export default Description;