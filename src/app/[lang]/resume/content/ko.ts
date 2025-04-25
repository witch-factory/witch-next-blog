import { ResumeContent } from '@/types/resume';

// 추후 en 버전도 추가
export const koResumeContent: ResumeContent = {
  labels: {
    summary: '소개',
    career: '경력',
    project: '프로젝트',
    presentation: '발표',
    education: '교육',
    activity: '활동',
  },
  name: '김성현',
  tagline: '기술을 이해하고, 글로 풀어내며, 팀을 돕습니다.',
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
  summary: '레거시의 맥락을 이해하고 이를 기반으로 더 나은 선택을 하고자 하는 개발자입니다. 기술적 선택과 학습에 관해 약 200개의 글을 작성해 왔으며 그 결과물을 실무에도 녹이기 위해 노력합니다. 자동화 도구나 공통 유틸리티를 주도적으로 개발하여 반복 작업을 줄이며 팀이 더 중요한 일에 집중할 수 있는 환경을 만드는 데 기여합니다.',
  career: [
    {
      title: 'Tmax FinAI',
      description: '보험 업무 전반을 위해 사용되는 배달서비스공제조합 페이지',
      tech: 'React, TypeScript, styled-components, React Hook Form, React Query',
      period: '2023.08 - 2024.09',
      role: '프론트엔드 연구원',
      details: [
        {
          title: '팀의 생산성을 위하여 개발 환경을 개선할 수 있는 유틸리티 제작',
          items: [
            { type: 'string', content: 'API 명세를 표 형식으로 변환하는 도구를 만들고 팀에 공유하여 문서 작성 시간 단축' },
            { type: 'string', content: '보험 용어 목록과 입력 데이터를 비교해 검토하는 도구를 만들고 공유하여 수작업 검토 프로세스 자동화' },
            { type: 'string', content: '웹소켓 기반 사내 API 통신을 위한 React Query 커스텀 훅을 팀 내 공용 유틸리티로 구현' },
          ],
        },
        {
          title: '클라이언트 요구사항을 충족하기 위한 페이지 구현',
          items: [
            { type: 'string', content: '보험 가입/처리를 위한 페이지와 공통 UI 컴포넌트 구현' },
            { type: 'string', content: '클라이언트 요구사항 충족을 위해 커스텀 time picker 구현' },
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
              text: '정리 글 링크', url: 'https://witch.work/ko/posts/blog-eslint-configuration',
            } },
          ],
        },
        {
          title: '사용자 경험 개선',
          items: [
            { type: 'note-link', content: '블로그의 글을 AI를 이용해 번역하고 다국어 지원 구현',
              note: {
                text: '정리 글 링크', url: 'https://witch.work/ko/posts/blog-auto-translation',
              } },
            { type: 'note-link', content: '사용자 브라우저의 언어에 맞게 자동으로 언어를 변경하고 SEO 설정', note: {
              text: '정리 글 링크', url: 'https://witch.work/ko/posts/blog-content-i18n',
            } },
            { type: 'string', content: '페이지 최적화로 Lighthouse 기준 성능 점수 75점 → 95점으로 개선' },
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
            { type: 'string', content: '기존 코드의 작성자와 논의하고 현재 필요한 기능과 확장 가능성을 고려하여 코드 리팩토링' },
            { type: 'string', content: '광범위한 요소를 선택하는 DOM API로 작성되어 유지보수가 까다롭던 코드를 React 기반으로 마이그레이션' },
            { type: 'string', content: '공통 컴포넌트를 Radix UI 라이브러리로 대체하고 불필요한 기능 제거' },
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
  presentation: [
    {
      title: '글또 10기 프론트 반상회',
      description: '기술 블로그를 운영하는 개발 직군들이 모여 함께 성장하는 커뮤니티 글또',
      role: '발표자, 참여자',
      period: '2025',
      links: [
        { text: '글또 홈페이지', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            { type: 'link', content: { text: '나의 방식으로 네트워킹 시작하기 - 커피챗을 30번 넘게 하고 알게 된 것들', url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf' } },
          ],
        },
      ],
    },
    {
      title: 'BBConf',
      description: '각자 알고 있는 유용한 지식을 나누자는 취지의 오픈 컨퍼런스',
      period: '2021 - 현재',
      role: '발표자, 참여자',
      links: [
        { text: '홈페이지', url: 'https://bbconf.kr/' },
        { text: '발표자료 아카이브', url: 'https://bbconf.kr/archive' },
      ],
      details: [
        {
          items: [
            { type: 'link', content: { text: '브라우저에서 google.com을 치면 생기는 일까지 생겼던 일', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf' } },
            { type: 'link', content: { text: '블로그로 진짜 개발자처럼 보이는 법', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf' } },
            { type: 'link', content: { text: 'JS는 왜 이 모양 이 꼴일까?', url: 'https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf' } },
          ],
        },
      ],
    },

    {
      title: 'GDG on Campus Hongik Univ.',
      description: '홍익대학교 최대 규모의 IT 커뮤니티',
      role: '발표자',
      period: '2023 - 2024',
      links: [
        { text: '홈페이지', url: 'https://www.gdschongik.com/' },
      ],
      details: [
        {
          items: [
            { type: 'link', content: { text: '내가 소프트웨어 마에스트로에서 배운 것들', url: 'https://www.youtube.com/watch?v=RXpOaKQES-g' } },
            { type: 'link', content: { text: '어떤 개발자가 되고 싶나요?', url: 'https://www.youtube.com/watch?v=SMMb56p7myg' } },
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
  activity: [
    {
      title: '글 쓰는 개발자 모임, 글또 9-10기 - 기술 블로그 운영 및 글 작성',
      items: [
        {
          type: 'link',
          content: {
            text: '"JS의 주석은 //과 /* */뿐만이 아니다" 네이버 FE News 2024년 2월 큐레이션 선정',
            url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4',
          },
        },
        {
          type: 'link',
          content: {
            text: '클로저, 수학자들의 꿈에서 JavaScript의 스타가 되기까지',
            url: 'https://witch.work/ko/posts/javascript-closure-deep-dive-history',
          },
        },
        {
          type: 'link',
          content: {
            text: 'TypeScript의 가변성(Variance)이란 무엇인가',
            url: 'https://witch.work/ko/posts/typescript-covariance-theory',
          },
        },
        {
          type: 'link',
          content: {
            text: '사파리의 Javascript 엔진, JavascriptCore 기여하기',
            url: 'https://witch.work/ko/posts/javascript-jscore-contribution',
          },
        },
      ],
    },
    {
      title: '오픈소스 활동',
      items: [
        {
          type: 'link',
          content: {
            text: 'MDN 영문 문서 오류 수정',
            url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory',
          },
        },
        {
          type: 'link',
          content: {
            text: 'MDN 한글 번역',
            url: 'https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory',
          },
        },
        {
          type: 'link',
          content: {
            text: 'JavaScript의 역사에 관한 약 120쪽 분량의 논문 번역, 배포',
            url: 'https://js-history.vercel.app/',
          },
        },
      ],
    },
    {
      title: '신촌지역 대학생 프로그래밍 동아리 연합',
      items: [
        {
          type: 'note-link',
          content: '2021년 100명 규모의 알고리즘 캠프 초급반 강사',
          note: {
            text: '당시 강의자료',
            url: 'https://github.com/witch-factory/2022-winter-sinchon-lecture',
          },
        },
        {
          type: 'note-link',
          content: '알고리즘 캠프 콘테스트 중급 운영진',
          note: {
            text: '대회 페이지',
            url: 'https://www.acmicpc.net/contest/view/948',
          },
        },
      ],
    },
    {
      title: '서강대학교 알고리즘 학회 Sogang ICPC Team',
      items: [
        {
          type: 'note-link',
          content: '서강대학교 프로그래밍 경진대회(SPC) 운영진',
          note: {
            text: '대회 페이지',
            url: 'https://www.acmicpc.net/contest/view/897',
          },
        },
        {
          type: 'note-link',
          content: '서강대학교 청정수컵 운영진',
          note: {
            text: '대회 페이지',
            url: 'https://www.acmicpc.net/contest/view/796',
          },
        },
        {
          type: 'string',
          content: '2022년 임원진 활동, 2년간의 문제풀이 스터디 운영 등의 기여',
        },
      ],
    },
  ],
};
