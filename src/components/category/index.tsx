import Card from 'src/components/card';

import styles from './styles.module.css';

interface CardProps{
  title: string;
  description: string;
  image?: string;
  date: string;
  url: string;
}

interface Props{
  title: string;
  items: CardProps[];
}

function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2>{props.title}</h2>
      <ul className={styles.list}>
        {props.items.map((item, index) => {
          return (
            <li key={index}>
              <Card 
                title={item.title} 
                description={item.description} 
                image={item.image}
                date={item.date} 
                url={item.url} 
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Category;