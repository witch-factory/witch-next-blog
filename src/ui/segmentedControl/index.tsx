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
            className={`${styles.label} ${isSelected ? styles.selected : ''}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onChange(item.value);
              }
            }}
          >
            <input
              type="radio"
              name={name}
              value={item.value}
              role="radio"
              aria-checked={isSelected}
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
