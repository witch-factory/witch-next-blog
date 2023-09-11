import { ChangeEvent } from 'react';

import styles from './styles.module.css';

interface Props{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function SearchConsole(props: Props) {
  const { value, onChange } = props;

  return (
    <input
      className={styles.input}
      placeholder='검색어를 입력하세요'
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchConsole;