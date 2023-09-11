import styles from './styles.module.css';

function ProjectTitle({ title }: {title: string}) {
  return (
    <h3 className={styles.title}>{title}</h3>
  );
}

export default ProjectTitle;