import Link from 'next/link';
import React from 'react';

import PageContainer from '@/components/pageContainer';

const NotFound = () => {
  return (
    <PageContainer>
      <h2 className='title-lg'>찾으시는 페이지가 없습니다.</h2>
      <Link href='/' className='link my-5'>
        <h3 className='title-md'>홈으로 돌아가기</h3>
      </Link>
    </PageContainer>
  );
};

export default NotFound;