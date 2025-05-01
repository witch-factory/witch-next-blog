import { ResumeContent } from '@/types/resume';

// 추후 en 버전도 추가
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
  tagline: '깊이를 가리지 않고 문제를 해결하는 프론트엔드 개발자입니다.',
  contact: [
    {
      label: '블로그',
      text: 'https://witch.work',
      url: 'https://witch.work',
    },
    {
      label: 'GitHub',
      text: 'https://github.com/witch-factory',
      url: 'https://github.com/witch-factory',
    },
    {
      label: '이메일',
      text: 'soakdma37@gmail.com',
      url: 'mailto:soakdma37@gmail.com',
    },
  ],
  summary: '내부 동작 분석을 통한 최적화와 같은 깊이있는 작업부터 간단한 백엔드 작성, LLM을 활용한 번역 기능, 팀을 위한 자동화 스크립트 작성 등 문제를 정의하고 효율적으로 해결하는 작업까지 해왔습니다. 기술적 선택과 학습에 관해 약 200편의 글을 작성해 왔으며 이 지식을 실무에 적용하기 위해 노력합니다. 문제의 깊이에 따라 적절한 방식으로 접근하며 다양한 수준에서 기여할 수 있는 개발자를 지향합니다.',
  career: [
    {
      title: 'Tmax FinAI',
      description: '보험 업무 전반을 위해 사용되는 배달서비스공제조합 페이지',
      tech: 'React, TypeScript, styled-components, React Hook Form, TanStack Query',
      period: '2023.08 - 2024.09',
      role: '프론트엔드 연구원',
      details: [
        {
          title: '팀의 생산성을 위하여 개발 환경을 개선할 수 있는 유틸리티 제작',
          items: [
            { type: 'string', content: 'API 명세를 표 형식으로 변환하는 도구를 만들고 팀에 공유하여 문서 작성 시간 50% 이상 단축' },
            { type: 'string', content: '보험 용어 목록과 입력 데이터를 비교해 검토하는 도구를 만들고 공유하여 수작업 검토 프로세스 80% 이상 자동화' },
            { type: 'string', content: '웹소켓 기반 사내 API 통신을 위해 TanStack Query로 제작한 커스텀 훅을 팀 내 공용 유틸리티로 공유' },
          ],
        },
        {
          title: '보험 업무 전반에 필요한 페이지 구현',
          items: [
            { type: 'string', content: '보험 가입 프로세스에서 사용자 조건에 따라 흐름이 분기되는 구조와 예외 상황 대응, 상태 관리 구현' },
            { type: 'string', content: '관리자 페이지에서 사용하는 사고 조회 팝업 전반을 맡아서 구현하고 다수의 페이지와 연동' },
            { type: 'string', content: '디자인 요구사항에 맞춰 24시간제 입력이 가능하며 키보드 조작과 접근성을 고려한 TimePicker 제작' },
            { type: 'string', content: 'Table, Card 등 공통 UI 컴포넌트를 보완하여 재사용성을 높이고, 모든 페이지에서 타입과 함께 활용할 수 있도록 개선' },
          ],
        },
      ],
    },
  ],
  project: [
    {
      title: '개인 블로그 제작',
      description: 'Next.js를 이용하며 다국어를 지원하는 개인 블로그',
      tech: 'Next.js, TypeScript, Vanilla-extract',
      period: '2023.05 - 현재',
      role: '블로그 운영자',
      links: [
        {
          text: '배포 링크',
          url: 'https://witch.work/',
        },
        {
          text: 'GitHub',
          url: 'https://github.com/witch-factory/witch-next-blog',
        },
      ],
      details: [
        {
          title: '블로그 구축',
          items: [
            { type: 'string', content: 'Next.js 12를 이용하여 블로그를 구현하고 RSC 업데이트 대응 등의 관리와 개선' },
            { type: 'string', content: 'remark 플러그인을 제작하여 TOC 제작, 마크다운 내의 이미지 경로 변경 자동화' },
            { type: 'string', content: 'SEO를 위해 OG 이미지 생성기, 사이트 메타데이터, 사이트맵, RSS 피드 도입' },
            { type: 'note-link', content: '최신 ESLint 9의 Flat Config를 프로젝트에 도입하고 설정 전환 과정 문서화', note: {
              text: '\u{1F517} 정리 글 링크', url: 'https://witch.work/ko/posts/blog-eslint-configuration',
            } },
          ],
        },
        {
          title: '사용자 경험 개선',
          items: [
            { type: 'note-link', content: '블로그에 AI 기반 자동 번역 시스템 구축, 영어 지원을 통해 글로벌 확장성 강화',
              note: {
                text: '\u{1F517} 정리 글 링크', url: 'https://witch.work/ko/posts/blog-auto-translation',
              } },
            { type: 'note-link', content: '사용자 브라우저의 언어에 맞게 자동으로 언어를 변경하고 SEO 설정', note: {
              text: '\u{1F517} 정리 글 링크', url: 'https://witch.work/ko/posts/blog-content-i18n',
            } },
            { type: 'string', content: '페이지 최적화로 Lighthouse 기준 성능 점수 75점 → 95점으로 개선' },
          ],
        },
        {
          title: '운영 중 문제 해결',
          items: [
            {
              type: 'note-link',
              content: '배포 시 빌드 실패 원인이 번들 사이즈임을 파악하고 데이터 구조 변경, 서드파티 코드 작성을 통해 번들 사이즈 70% 감축',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/blog-bundle-reduction',
              },
            },
            {
              type: 'note-link',
              content: 'Next.js의 ESLint 플러그인이 동작하지 않는 것이 pnpm의 동작 방식 문제임을 알아내고 근본적인 문제 해결',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/blog-eslint-pnpm-bugfix',
              },
            },
            {
              type: 'note-link',
              content: '블로그에 새로운 요소들을 추가하며 성능이 떨어진 문제 원인이 불필요한 데이터의 로딩임을 확인하고 해결',
              note: {
                text: '\u{1F517} 정리 글 링크',
                url: 'https://witch.work/ko/posts/blog-fix20230808',
              },
            },
          ],
        },
      ],
    },
    {
      title: '신촌 대학생 프로그래밍 동아리 연합',
      description: '알고리즘 캠프 운영에 사용되는 홈페이지와 관리자 페이지 개선 작업',
      tech: 'Next.js, TypeScript, Radix UI, Express, Prisma, Google Cloud Platform',
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
          title: '프론트엔드 개발',
          items: [
            { type: 'string', content: 'Next.js 10 + JavaScript 코드를 Next.js 12 + TypeScript로 마이그레이션' },
            { type: 'string', content: '레거시의 작성자와 논의하여 코드가 작성된 맥락과 의도를 반영한 핵심 기능 중심으로 코드 리팩토링' },
            { type: 'string', content: '광범위한 요소를 선택하는 DOM API로 작성되어 유지보수가 어렵던 기존 컴포넌트들을 React와 Radix UI 기반으로 마이그레이션' },
          ],
        },
        {
          title: '백엔드 개발',
          items: [
            { type: 'string', content: '학생 정보 관리, 강의 출석 관리, 과제 제출 확인, 강의료 계산 등의 기능을 수행하는 API 서버 작성' },
            { type: 'string', content: 'Go와 raw query 기반의 기존 코드를 유지보수가 용이한 Node.JS, TypeScript, Prisma ORM 기반으로 마이그레이션' },
            { type: 'string', content: '디스코드 비대면 강의를 위한 출석 봇을 discord.js 라이브러리로 구현 후 서버와 함께 배포' },
          ],
        },
      ],
    },
  ],
  activity: [
    {
      title: '글 쓰는 개발자 모임, 글또 9-10기',
      description: '우수 글을 선별하는 큐레이션(5% 미만 선정률)에 10편의 글 선정, 100명 규모 모임에서 발표 진행',
      role: '발표자, 참여자',
      period: '2023 - 2025',
      links: [
        { text: '글또 홈페이지', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            { type: 'note-link',
              content: '글또 프론트엔드 반상회 발표 - \'나의 방식으로 네트워킹 시작하기\'',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf',
              },
            },
            { type: 'note-link',
              content: 'JavaScript의 특수한 주석 형식에 관한 글, 네이버 FE News 2024년 2월 큐레이션 선정',
              note: {
                text: '\u{1F517} 글 링크',
                url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4',
              },
            },
            { type: 'note-link',
              content: '클로저의 역사에 딥다이브하여 튜링 기계부터 JavaScript까지 되짚어 올라오는 글, 글또 10기 3회차 큐레이션 선정',
              note: {
                text: '\u{1F517} 글 링크',
                url: 'https://witch.work/ko/posts/javascript-closure-deep-dive-history',
              },
            },
            { type: 'note-link',
              content: '컨텐츠 관리 라이브러리 velite의 소개 글, 글또 9기 10회차 큐레이션 선정',
              note: {
                text: '\u{1F517} 글 링크',
                url: 'https://witch.work/ko/posts/velite-library-introduction',
              },
            },
            { type: 'note-link',
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
    {
      title: 'BBConf',
      description: '각자 알고 있는 유용한 지식을 나누자는 취지의 30명 규모 오픈 컨퍼런스',
      period: '2021 - 현재',
      role: '발표자, 참여자',
      links: [
        { text: '홈페이지', url: 'https://bbconf.kr/' },
      ],
      details: [
        {
          items: [
            { type: 'note-link',
              content: '컴퓨터, 네트워크, 웹에 관한 간략한 역사와 오해를 바로잡는 발표',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf',
              },
            },
            { type: 'note-link',
              content: '블로그를 오랫동안 운영하는 동력을 얻고 좋은 글을 쓰기 위한 노하우에 대한 발표',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf',
              },
            },
            { type: 'note-link',
              content: 'JavaScript의 초기 역사와 언어적인 선택들에 관한 발표',
              note: {
                text: '\u{1F517} 발표 자료 링크',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf',
              },
            },
          ],
        },
      ],
    },
    {
      title: '지식 공유 오픈소스 활동',
      period: '2023 - 현재',
      details: [
        {
          items: [
            { type: 'note-link',
              content: '웹 개발에 필수적인 MDN 영문 문서의 역사적인 오류 수정',
              note: {
                text: '\u{1F517} PR 목록 링크',
                url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory',
              },
            },
            { type: 'note-link',
              content: 'MDN의 JavaScript 레거시 문법에 관한 문서를 한글 번역',
              note: {
                text: '\u{1F517} PR 목록 링크',
                url: 'https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory',
              },
            },
            { type: 'note-link',
              content: 'JavaScript의 역사에 관한 약 120쪽 분량의 논문 번역, 배포',
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
      title: '학생 커뮤니티',
      period: '2021 - 2024',
      details: [
        {
          items: [
            { type: 'note-link',
              content: 'GDG on Campus Hongik Univ., SW마에스트로 과정에서 배운 것에 관한 발표',
              note: {
                text: '\u{1F517} 발표 영상 링크',
                url: 'https://www.youtube.com/watch?v=RXpOaKQES-g',
              },
            },
            { type: 'note-link',
              content: 'GDG on Campus Hongik Univ., 개발자의 진로 설정에 관한 발표',
              note: {
                text: '\u{1F517} 발표 영상 링크',
                url: 'https://www.youtube.com/watch?v=SMMb56p7myg',
              },
            },
            {
              type: 'note-link',
              content: '신촌 지역 대학생 약 100명을 대상으로 겨울방학 알고리즘 강의 진행',
              note: {
                text: '\u{1F517} 강의자료 링크',
                url: 'https://github.com/witch-factory/2022-winter-sinchon-lecture',
              },
            },
            {
              type: 'note-link',
              content: '서강대학교 프로그래밍 경진대회(SPC) 운영진',
              note: {
                text: '\u{1F517} 대회 페이지 링크',
                url: 'https://www.acmicpc.net/contest/view/897',
              },
            },
            {
              type: 'string',
              content: '서강대학교 알고리즘 학회 2022년 임원진으로 활동하며 스터디 진행, 2개의 대회 운영',
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
        { type: 'string', content: '사회인 밴드 활동을 돕는 플랫폼 "밴드웨건" 개발' },
        { type: 'string', content: 'React, zustand, Tailwind CSS 등 사용' },
      ],
    },
  ],
};
