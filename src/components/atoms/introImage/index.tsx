import Image from 'next/image';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

interface Props {
  imageSrc: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  };
  imageAlt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// 프로필 사진, 프로젝트 소개 사진에 쓰일 것이다
function IntroImage({ 
  imageSrc, 
  imageAlt,
  placeholder = 'blur',
  width = 200,
  height = 200,
  ...props 
}: Props) {
  return (
    <div className={styles.container}>
      <Image 
        src={imageSrc[blogConfig.imageStorage]} 
        alt={imageAlt} 
        style={{ transform: 'translate3d(0, 0, 0)' }}
        placeholder={placeholder}
        blurDataURL={imageSrc.blurURL}
        className={styles.image}
        width={width}
        height={height}
        {...props} 
      />
    </div>

  );
}

export default IntroImage;