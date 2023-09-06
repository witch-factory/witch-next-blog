import Image from 'next/image';

interface Props {
  imageSrc: string;
  imageAlt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

function Icon({ imageSrc, imageAlt, width=20, height=20, priority }: Props) {
  return (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={width}
      height={height}
      priority={priority}
    />
  );
}

export default Icon;