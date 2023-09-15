import styles from './styles.module.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Tag({ children, className }: React.PropsWithChildren<Props>) {
  return (
    <li className={`${styles.tag} ${className}`}>
      {children}
    </li>
  );
}

export default Tag;