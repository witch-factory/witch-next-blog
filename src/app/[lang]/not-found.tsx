import Link from 'next/link';
import React from 'react';

import Frame from '@/containers/frame';

import * as styles from './notFoundStyles.css';

// TODO: not found page를 모든 라우트에 대해 정의
const NotFound = () => {
  return (
    <Frame>
      <h2 className={styles.titieLg}>찾으시는 페이지가 없습니다.</h2>
      <Link href="/" className={styles.link}>
        <h3 className={styles.titleMd}>홈으로 돌아가기</h3>
      </Link>
    </Frame>
  );
};

export default NotFound;
