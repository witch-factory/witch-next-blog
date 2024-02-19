import styles from './styles.module.css';

function ViewCounter({ view }: {view: number}) {
  return (
    <p className={styles.counter}>전체 방문: {view}회</p>
  );
}

export default ViewCounter;