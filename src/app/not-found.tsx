import Link from 'next/link';
import React from 'react';

import Flex from '@/containers/flex';
import Frame from '@/containers/frame';
import Heading from '@/ui/heading';

const NotFound = () => {
  return (
    <Frame>
      <Flex gap="lg" direction="column">
        <Heading as="h2" size="xl">찾으시는 페이지가 없습니다.</Heading>
        <Link href="/">
          <Heading as="h3" size="md">홈으로 돌아가기</Heading>
        </Link>
      </Flex>
    </Frame>
  );
};

export default NotFound;
