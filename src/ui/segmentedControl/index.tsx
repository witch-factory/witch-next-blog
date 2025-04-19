import * as styles from './styles.css';

type Item = {
  label: string,
  value: string,
};

type Props = {
  name: string,
  items: Item[],
  selectedValue: string,
  onChange: (value: string) => void,
};

// https://designbase.co.kr/dictionary/segmented-control/
export default function SegmentedControl({ name, items, selectedValue, onChange }: Props) {
  return (
    <div className={styles.container} role="radiogroup">
      {items.map((item) => {
        const isSelected = item.value === selectedValue;
        return (
          <label
            key={item.value}
            className={`${styles.label} ${item.value === selectedValue ? styles.selected : ''}`}
            aria-checked={isSelected}
            role="radio"
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              checked={isSelected}
              onChange={() => { onChange(item.value); }}
              className={styles.input}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
}
