import Image from 'next/image';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

interface ImageSrc{
  local: string;
  cloudinary: string;
  blurURL?: string;
}

function ProjectImage({title, image}: {title: string, image: ImageSrc}) {
  return (
    <div className={styles.container}>
      <Image
        className={styles.image}
        src={image[blogConfig.imageStorage]} 
        alt={`${title} 프로젝트 사진`}
        width={300}
        height={300}
        sizes='(max-width: 768px) 150px, 300px'
        placeholder={image.blurURL ? 'blur' : 'empty'}
        blurDataURL={image.blurURL}
      />
    </div>
  );
}

export default ProjectImage;