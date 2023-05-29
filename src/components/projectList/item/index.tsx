import Image from 'next/image';
import Link from 'next/link';

import { projectType } from 'blog-project';

import styles from './styles.module.css';

function Item({project}: {project: projectType}) {
  return (
    <article className={styles.container}>
      <Image 
        className={styles.image}
        src={project.image} 
        alt={project.title}
        width={80} 
        height={80}
      />
      <div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.list}>
          {project.url.map((url,) =>
            <li key={url.link}>
              <Link 
                className={styles.link} 
                href={url.link} 
                target='_blank'
              >
                {url.title}
              </Link>
            </li>
          )}
        </ul>
        <ul className={styles.list}>
          {project.techStack.map((tech) =>
            <li key={tech} className={styles.tech}>{tech}</li>
          )}
        </ul>
      </div>
    </article>
  );
}

export default Item;