import styles from './styles.module.css';

interface Props{
  title: string;
}

function Title(props: Props) {
  return (
    <h2 className={styles.title}>{props.title}</h2>
  );
}

export default Title;