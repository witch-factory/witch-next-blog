import styles from './styles.module.css';

function ThemeChanger() {
  return (
    <button
      className={styles.toggle}
      title='Toggles light & dark'
      aria-label='Toggles light & dark'
      aria-live='polite'
    >
      Hi
    </button>
  );
}

export default ThemeChanger;