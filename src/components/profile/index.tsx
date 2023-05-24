import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

function Profile() {
  return (
    <article>
      <Image src={blogConfig.picture} alt={`${blogConfig.name} 프로필사진`} width={100} height={100} />
      <h2>{blogConfig.name}</h2>
      <p>{blogConfig.description}</p>
      <ul>
        <li>
          <Link href={`https://github.com/${blogConfig.social.github}`} target='_blank'>
            Github
          </Link>
        </li>
      </ul>
    </article>
  );
}

export default Profile;