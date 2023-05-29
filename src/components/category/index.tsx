import Card from 'src/components/card';

import styles from './styles.module.css';

interface CardProps{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

interface Props{
  title: string;
  url: string;
  items: CardProps[];
}

function propsProperty(item: CardProps) {
  const { title, description, image, date, tags, url } = item;
  return { title, description, image, date, tags, url };
}

function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2>{props.title}</h2>
      
      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...propsProperty(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Category;