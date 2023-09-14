import Link from 'next/link';

interface Props{
  name: string;
  url: string;
  className?: string;
}

function Copyright({ name, url, className }: Props) {
  return (
    <p className={className ?? ''}>
    © {name},
      <Link href={url} target='_blank'> witch-next-blog</Link>, 
    2023
    </p>
  );
}

export default Copyright;