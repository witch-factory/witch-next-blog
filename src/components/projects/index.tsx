import Card from 'src/components/card';

interface CardProps{
  title: string;
  description: string;
  image: string;
  date: string;
  url: string;
}

interface Props{
  title: string;
  items: CardProps[];
}

function Projects(props: Props) {
  <article>
    <h2>{props.title}</h2>
    <ul>
      {
        props.items.map((item, index) => {
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
        })
      }
    </ul>
  </article>;
}

export default Projects;