import Link from 'next/link';

import Card, { CardProps }  from 'src/components/card';

import styles from './styles.module.css';

export interface CategoryProps{
  title: string;
  url: string;
  items: CardProps[];
}

function Category(props: CategoryProps) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <Link href={props.url}>
          {props.title} {'\u{1F517}'}
        </Link>
      </h2>
      
      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...item}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Category;