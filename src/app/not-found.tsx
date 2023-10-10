import Link from 'next/link';
import React from 'react';

import Title from '@/components/atoms/title';
import PageContainer from '@/components/templates/pageContainer';

const NotFound = () => {
  return (
    <PageContainer>
      <Title heading='h2' className='title-lg'>
        찾으시는 페이지가 없습니다.
      </Title>
      <Link href='/' className='link my-5'>
        <Title heading='h3' className='title-md'>
          홈으로 돌아가기
        </Title>
      </Link>
    </PageContainer>
  );
};

export default NotFound;