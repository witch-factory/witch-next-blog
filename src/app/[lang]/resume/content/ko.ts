import { ResumeContent } from '@/types/resume';

export const koResumeContent: ResumeContent = {
  labels: {
    summary: '소개',
    career: '경력',
    project: '프로젝트',
    // presentation: '발표',
    education: '교육',
    activity: '활동',
  },
  name: '김성현',
  tagline: [
    '삶의 불편을 덜어내는 일보다는 즐거움을 더하는 일을 하고 싶어합니다.',
    '사람을 빠져들게 하는 길을 깔기 위해 고민합니다.',
  ],
  contact: [
    {
      label: '블로그',
      text: 'witch.work',
      url: 'https://witch.work',
    },
    {
      label: 'GitHub',
      text: 'witch-factory',
      url: 'https://github.com/witch-factory',
    },
    {
      label: '이메일',
      text: 'soakdma37@gmail.com',
      url: 'mailto:soakdma37@gmail.com',
    },
  ],
  summary: '사이드 프로젝트의 2번째 멤버(Founding Engineer)로 합류하여 DAU 1만, 월 매출 약 3억 원 규모까지 함께 성장시켰습니다. 제품의 특성과 소비자의 니즈를 빠르게 파악하고, 제품의 모든 부분에서 문제를 찾아 해결합니다. 기술 학습에 대해 약 200편의 글을 블로그에 기록해 왔습니다.',
  career: [
    {
      title: '주식회사 아이오시아',
      description: 'AI 캐릭터 채팅 서비스 "엘린"',
      tech: 'Next.js, React, TypeScript, Tailwind CSS, FastAPI',
      period: '2026.01 - 2026.07',
      role: 'Founding Engineer (Fullstack)',
      links: [
        {
          text: '서비스 링크',
          url: 'https://elyn.ai/',
        },
      ],
      details: [
        {
          items: [
            { type: 'string', content: '토이프로젝트에서 시작한 회사를 DAU 1만, 월 매출 3억원 규모로 함께 성장시켜 인수되기까지의 과정을 함께했습니다.' },
          ],
        },
        {
          title: '제품 기능과 운영 개선',
          items: [
            { type: 'string', content: '"AI로 유저 설정 빠르게 만들기" 기능을 제안하고 구현: 유저 패턴과 커뮤니티 반응, 서비스 사용 경험을 종합해 진입 장벽 지점 특정' },
            { type: 'string', content: '채팅 데이터 동기화 문제 해결: 분산되어 있던 채팅 조회, 스트리밍 처리, 캐시 갱신 로직을 통합하고 서버 데이터가 SSOT가 되도록 재설계' },
            { type: 'string', content: '업데이트 공지와 CS 처리 절차 수립 및 서비스 내 채널로 이관: 외부 SNS에 의존하던 운영방식을 기능 구현과 함께 개편' },
          ],
        },
        {
          title: '제품 성능 개선',
          items: [
            { type: 'string', content: '네트워크 전송량 50% 이상 절감: API 중복 호출 제거, 스트리밍 완료시 데이터 갱신 방식 개선' },
            { type: 'string', content: '메인 페이지 Lighthouse 성능 점수 35점 → 70점: 컨테이너 너비를 JS로 측정한 뒤 요소를 렌더링하던 로직을 CSS 기반으로 전환, 로딩 스켈레톤 도입, 폰트 lazy loading 등의 최적화 적용' },
            { type: 'string', content: '스트리밍 토큰마다 리렌더링되는 메시지 최소 20개 → 1개로 최적화: 목록 전체가 재생성되던 구조를 참조 분리해 갱신 중인 메시지만 리렌더링' },
            { type: 'string', content: '채팅 내 검색 결과로 이동시 네트워크 요청 최대 50회 → 1회: 페이지를 순차 요청하던 방식을 서버 양방향 페이지네이션 도입으로 대체' },
          ],
        },
        {
          title: '개발 환경 개선',
          items: [
            { type: 'string', content: 'MobX, zustand, SWR, TanStack Query가 혼재한 레거시 구조를 zustand와 TanStack Query 기반으로 통합하고 미사용 코드를 정리해 프로덕션 코드 약 4만 줄 순감소' },
            { type: 'string', content: '서버와 클라이언트의 데이터 경계, 쿼리 키 관리, 스트리밍 처리 등 정책을 정의하고 문서화해 팀 컨벤션으로 정착' },
            { type: 'string', content: '유저 작성 JSX 컴포넌트의 보안 문제 해결: AI 사전 검수와 iframe 격리를 제안해 적용, 이후 발생한 미디어 쿼리 문제를 CSS 컨테이너 쿼리로 대응' },
          ],
        },
      ],
    },
    {
      title: '주식회사 그래픽',
      description: '글로벌 웹툰 서비스 "그래픽"',
      tech: 'Next.js, React, TypeScript, styled-components, SvelteKit, Firebase',
      period: '2025.07 - 2026.01',
      role: 'Frontend Developer',
      links: [
        {
          text: '서비스 링크',
          url: 'https://graphic.fan/',
        },
      ],
      details: [
        {
          items: [
            { type: 'string', content: 'i18n 구축 및 국가별 창작자 수익 정산 퍼널 전체 정책 분기를 담당자와 설계하고 구현' },
            { type: 'string', content: '만화 매장의 고객 입장/퇴장 관리 시스템의 복잡한 요금 정책을 모듈화해 변경에 강한 구조로 재편' },
            { type: 'string', content: '매장 팀원들과 소통하며 퇴장 처리 복구, 메모, 문의 응대용 매크로, 재고 갱신 자동화 등 현장에 실질적으로 필요한 기능을 추가' },
          ],
        },
      ],
    },
    {
      title: 'Tmax FinAI',
      description: '배달서비스공제조합 라이더보험 페이지',
      tech: 'React, TypeScript, styled-components, React Hook Form, TanStack Query',
      period: '2023.08 - 2024.09',
      role: '프론트엔드 연구원',
      details: [
        {
          items: [
            { type: 'string', content: '보험 용어 검수 등 팀의 반복 업무를 자동화하는 도구를 개발하고 팀에 공유해 수작업 시간 50% 이상 단축' },
            { type: 'string', content: '디자인 요구사항에 맞춰 키보드 조작, 접근성(a11y), 타입을 고려한 TimePicker 등의 컴포넌트 제작' },
          ],
        },
      ],
    },
  ],
  project: [
    {
      title: '개인 블로그 제작',
      description: 'Next.js를 이용하며 다국어를 지원하는 개인 블로그',
      tech: 'Next.js, TypeScript, vanilla-extract',
      period: '2023.05 - 현재',
      role: '블로그 운영자',
      links: [
        {
          text: '블로그 링크',
          url: 'https://witch.work/',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/witch-factory/witch-next-blog',
        },
      ],
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Next.js로 블로그를 직접 구축하고 remark 플러그인 제작을 통한 목차 생성, 이미지 경로 변경 자동화',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/tag/blog',
              },
            },
            {
              type: 'note-link',
              content: '블로그에 AI 기반 자동 번역 시스템 구축, 영어 지원을 통해 글로벌 확장성 강화',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/blog-auto-translation',
              },
            },
            {
              type: 'note-link',
              content: '빌드 실패 원인이 번들 사이즈임을 파악하고 설계 변경, 서드파티 코드 작성을 통해 번들 사이즈 70% 감축',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/blog-bundle-reduction',
              },
            },
          ],
        },
      ],
    },
    {
      title: '신촌 대학생 프로그래밍 동아리 연합',
      description: '알고리즘 캠프 운영에 사용되는 홈페이지와 관리자 페이지 개선 작업',
      tech: 'Next.js, TypeScript, Nest.js, Prisma, Google Cloud Platform',
      period: '2024.05 - 2024.12',
      role: '프로그램 관리팀장',
      links: [
        {
          text: '홈페이지',
          url: 'https://icpc-sinchon.io',
        },
      ],
      details: [
        {
          items: [
            { type: 'string', content: '강의 출석, 과제 제출 등을 처리하는 API 서버를 Go 기반에서 Nest.js, Prisma 기반으로 재작성' },
            { type: 'string', content: '비대면 강의를 위한 출석 봇을 discord.js 라이브러리로 구현 후 서버와 함께 배포' },
          ],
        },
      ],
    },
  ],
  activity: [
    {
      title: '오픈소스 기여',
      period: '2023 - 현재',
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Prisma 하이라이팅 플러그인을 작성해 공식 서드파티로 등재',
              note: {
                text: 'highlight.js PR #4252',
                url: 'https://github.com/highlightjs/highlight.js/pull/4252',
              },
            },
            {
              type: 'note-link',
              content: 'Yorkie JS SDK 모노레포의 ESLint 설정을 flat config로 마이그레이션',
              note: {
                text: 'yorkie-js-sdk PR #1045',
                url: 'https://github.com/yorkie-team/yorkie-js-sdk/pull/1045',
              },
            },
            {
              type: 'note-link',
              content: 'lodash를 es-toolkit으로 교체해 Yorkie JS SDK 예제 번들 크기 98% 감축',
              note: {
                text: 'yorkie-js-sdk PR #1101',
                url: 'https://github.com/yorkie-team/yorkie-js-sdk/pull/1101',
              },
            },
            {
              type: 'note-link',
              content: 'MDN 문서의 `@@unscopables` 관련 역사적 서술 오류 수정',
              note: {
                text: 'mdn/content PR #34646',
                url: 'https://github.com/mdn/content/pull/34646',
              },
            },
            {
              type: 'note-link',
              content: 'MDN 문서의 `NaN` 관련 역사적 서술 오류 수정',
              note: {
                text: 'mdn/content PR #35496',
                url: 'https://github.com/mdn/content/pull/35496',
              },
            },
            {
              type: 'note-link',
              content: 'JavaScriptCore 엔진 소스 주석의 오류 수정',
              note: {
                text: 'WebKit PR #25696',
                url: 'https://github.com/WebKit/WebKit/pull/25696',
              },
            },
            {
              type: 'note-link',
              content: 'JavaScript의 역사에 관한 약 120쪽 분량의 논문 번역과 배포',
              note: {
                text: '\u{1F517} 배포 링크',
                url: 'https://js-history.vercel.app/',
              },
            },
          ],
        },
      ],
    },
    {
      title: '발표',
      period: '2021 - 현재',
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: '글또 프론트엔드 반상회, \'나의 방식으로 네트워킹 시작하기\'',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf',
              },
            },
            {
              type: 'note-link',
              content: 'BBConf, 컴퓨터/네트워크/웹의 간략한 역사를 소개하고 오해를 바로잡는 발표',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf',
              },
            },
            {
              type: 'note-link',
              content: '블로그를 오랫동안 운영하는 동력을 얻고 좋은 글을 쓰기 위한 노하우에 대한 발표',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf',
              },
            },
            {
              type: 'note-link',
              content: '신촌 지역 대학생 약 100명을 대상으로 겨울방학 알고리즘 강의 진행',
              note: {
                text: '\u{1F517} 강의자료 링크',
                url: 'https://github.com/witch-factory/presentations',
              },
            },
          ],
        },
      ],
    },
    {
      title: '글 쓰는 개발자 모임, 글또 9-10기',
      description: '우수 글을 선별하는 큐레이션(5% 미만 선정률)에 총 10편의 글 선정',
      period: '2023 - 2025',
      links: [
        { text: '글또 홈페이지', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'JavaScript의 특수한 주석 형식에 관한 글, 네이버 FE News 2024년 2월 큐레이션 선정',
              note: {
                text: '\u{1F517} 큐레이션 링크',
                url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4',
              },
            },
            {
              type: 'note-link',
              content: '클로저의 역사에 딥다이브하여 튜링 기계부터 JavaScript까지 되짚어 올라오는 글, 글또 10기 3회차 큐레이션 선정',
              note: {
                text: '\u{1F517} 글 링크',
                url: 'https://witch.work/ko/posts/javascript-closure-deep-dive-history',
              },
            },
            {
              type: 'note-link',
              content: '타입 시스템의 가변성을 TypeScript로 설명한 글, 글또 9기 1회차 큐레이션 선정',
              note: {
                text: '\u{1F517} 글 링크',
                url: 'https://witch.work/ko/posts/typescript-covariance-theory',
              },
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      title: '서강대학교 기계공학과/컴퓨터공학과 졸업',
      period: '2015.03 - 2023.02',
      items: [
        { type: 'string', content: '컴퓨터공학 전공학점 4.03/4.3' },
      ],
    },
    {
      title: '소프트웨어 마에스트로 13기',
      period: '2022.07 - 2022.11',
      items: [
        { type: 'string', content: 'React, zustand, Tailwind CSS를 활용해 사회인 밴드 플랫폼 "밴드웨건" 개발' },
      ],
    },
  ],
};
