import Link from 'next/link';

import { ProfileLinkType } from '@/types/components';

import styles from './styles.module.css';


function ProfileLink({ siteName, siteLink }: ProfileLinkType) {
  return (
    <Link href={siteLink} target='_blank' className={styles.link}>
      {siteName}
    </Link>
  );
}

function ProfileLinkList({ linkList }: {linkList: ProfileLinkType[]}) {
  return (
    <ul className={styles.linkList}>
      {linkList.map((link) => (
        <li key={link.siteName} className={styles.linkBox}>
          <ProfileLink siteName={link.siteName} siteLink={link.siteLink} />
        </li>
      ))}
    </ul>
  );
}


export default ProfileLinkList;