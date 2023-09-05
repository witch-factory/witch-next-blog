import Image from 'next/image';

import styles from './styles.module.css';

interface Props {
  imageSrc: string;
  imageAlt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// 프로필 사진, 프로젝트 소개 사진에 쓰일 것이다
function IntroPicture({ 
  imageSrc, 
  imageAlt,
  placeholder = 'blur',
  ...props 
}: Props) {
  return (
    <Image 
      src={imageSrc} 
      alt={imageAlt} 
      placeholder={placeholder} 
      className={styles.image}
      {...props} 
    />
  );
}

export default IntroPicture;