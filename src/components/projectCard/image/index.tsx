

import { CldImage } from 'next-cloudinary';

import styles from './styles.module.css';

function ProjectImage({title, image}: {title: string, image: string}) {
  return (
    <div className={styles.container}>
      <CldImage
        className={styles.image}
        src={image} 
        alt={`${title} 프로젝트 사진`}
        width={300}
        height={300}
        sizes='(max-width: 768px) 150px, 300px'
      />
    </div>
  );
}

export default ProjectImage;