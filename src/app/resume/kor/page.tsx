import * as styles from '../resumeStyle.css';

function ResumeKOR() {
  return (
    <div className={styles.container}>
      <h1>김성현 (Kim Sung Hyun)</h1>
      <p className='intro'>
      프론트엔드 개발자입니다.
        <br />
        기계공학을 전공하다 개발을 사랑한다고 단 1초도 망설임없이 말할 수 있는
        열정적인 사람들을 만났고, 그들에게 마음이 끌려 개발자가 되었습니다. 그런
        사람들과 함께 문제를 해결하고 원리를 탐구하는 것을 즐깁니다.
      </p>
      <section>
        <ul>
          <li>
            블로그:&nbsp;<a target='_blank' href='https://witch.work'
            >https://witch.work</a>
          </li>
          <li>
            GitHub:&nbsp;<a
              target='_blank'
              href='https://github.com/witch-factory'
            >https://github.com/witch-factory</a>
          </li>
          <li>
            <address>
              이메일:&nbsp;<a href='mailto:soakdma37@gmail.com'
              >soakdma37@gmail.com</a>
            </address>
          </li>
        </ul>
      </section>
      <section>
        <h2>경력</h2>
        <section>
          <h3>Tmax FinAI</h3>
          <p className='text-muted'>2023.08 - 현재, 프론트엔드 연구원</p>
          <h4>배달서비스공제조합 관리자 서비스</h4>
          <ul>
            <li>
              기술:&nbsp;React, TypeScript, styled-components, React Hook Form,
              React Query
            </li>
            <li>
              보험처리를 위한 사고 정보 열람 페이지/팝업, 진료비 조회, 현장 출동
              정보 페이지 구현
            </li>
            <li>
              time picker, 탭, 라디오버튼 형식의 카드 등 공통 컴포넌트 구현
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h2>프로젝트</h2>
        <section>
          <h3>신촌지역 대학생 프로그래밍 동아리 연합 프로그램 관리</h3>
          <p className='text-muted'>2024.05 - 현재, 프로그램 관리팀장</p>
          <ul>
            <li>
              연합 홈페이지와 연합에서 운영하는 알고리즘 캠프의 관리자 페이지
              개선, 관리
            </li>
            <li>
              학생 정보 관리, 강의 출석 관리, 과제 제출 확인, 강의료 환급 등의
              기능과 페이지 구현
            </li>
          </ul>
          <h4>프론트엔드</h4>
          <ul>
            <li>
              기술:&nbsp;Next.js, TypeScript, styled-components, Radix UI, SWR
            </li>
            <li>
              Next.js 10 + JavaScript 코드를 Next.js 12 + TypeScript로
              마이그레이션
            </li>
            <li>
              기존 코드의 작성자와 코드의 의도를 논의하고 현재 필요한 기능과
              확장 가능성을 고려하여 코드 리팩토링
            </li>
            <li>
              광범위한 요소를 선택하는 DOM API 기반으로 짜여 변경을 어렵게 하던
              코드를 React hook 기반으로 재작성
            </li>
            <li>
              공통 컴포넌트에서 사용되지 않던 기능을 제거하고 Radix UI
              라이브러리를 도입해 코드를 간결하게 개선
            </li>
          </ul>
          <h4>
            백엔드&nbsp;<a
              target='_blank'
              href='https://witch.work/posts/project-backend-gcp-deploy'
            >[배포 일지]</a>
          </h4>
          <ul>
            <li>기술:&nbsp;Express, Prisma, Google Cloud Platform, Vitest</li>
            <li>
              Go와 raw query 기반으로 되어 있었던 기존 코드의 유지보수가
              불가능하다고 판단하여 Node.JS, TypeScript, Prisma ORM 기반으로
              재작성
            </li>
            <li>
              디스코드 비대면 강의의 출석을 위해 discord.js 라이브러리를 이용해
              출석 봇을 만들고 서버와 같이 배포
            </li>
          </ul>
        </section>
        <section>
          <h3>
            개인 블로그 제작&nbsp;<a target='_blank' href='https://witch.work/'
            >[블로그]&nbsp;</a>
            <a
              target='_blank'
              href='https://github.com/witch-factory/witch-next-blog'
            >
              [GitHub]
            </a>
          </h3>
          <p className='text-muted'>2023.05 - 현재</p>
          <ul>
            <li>기술:&nbsp;Next.js, TypeScript, Vanilla-extract</li>
            <li>remark 플러그인을 작성하여 글 목차, 썸네일 자동 생성 구현</li>
            <li>
              디바운싱 최적화가 적용된 글 검색, Redis를 사용한 조회수 카운터
              기능 구현
            </li>
            <li>
              사용자에게 컨텐츠를 빠르게 전달하기 위해 페이지 성능을 개선하여
              lighthouse 성능 점수 20점 이상 향상
            </li>
            <li>
              Next.js 13 버전의 RSC를 사용하도록 코드 변경, 라이브러리 버전
              업데이트에 따른 코드 수정 등의 이슈 해결
            </li>
          </ul>
        </section>
        <section>
          <h3>
            사회인 밴드 플랫폼 밴드웨건&nbsp;<a
              target='_blank'
              href='https://github.com/swm-broccoli/bandwagon-frontend-revise'
            >[GitHub]</a>
          </h3>
          <p className='text-muted'>
            2022.07 - 2022.11, 소프트웨어 마에스트로 13기
          </p>
          <ul>
            <li>기술:&nbsp;React, TypeScript, Zustand, TailwindCSS</li>
            <li>
              로그인, 회원가입, 회원 정보 관리, 밴드 관리, 구인구직 게시판, 일정
              관리 페이지 구현
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h2>활동</h2>
        <section>
          <h3>JavaScript 관련 활동</h3>
          <ul>
            <li>
              <a
                target='_blank'
                href='https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4'
              >
                &quot;JS의 주석은 //과 /* */뿐만이 아니다&quot; 네이버 FE News 2024년 2월
                큐레이션 선정
              </a>
            </li>
            <li>
              <a
                href='https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory'
              >MDN 영문 문서 오류 수정</a>,&nbsp;<a
                href='https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory'
              >한글 번역</a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/WebKit/WebKit/pull/25696'
              >
                WebKit JavaScriptCore 엔진 코드의 주석 설명 수정
              </a>
            </li>
            <li>
              <a target='_blank' href='https://js-history.vercel.app/'
              >JavaScript의 역사에 관한 약 120쪽 분량의 논문 번역, 배포</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>
            신촌지역 대학교 프로그래밍 동아리 연합&nbsp;<a
              target='_blank'
              href='https://icpc-sinchon.io'
            >[홈페이지]</a>
          </h3>
          <p className='text-muted'>2022 - 2023</p>
          <ul>
            <li>
              100명 규모의 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프
              초급반 강사&nbsp;<a
                target='_blank'
                href='https://github.com/witch-factory/2022-winter-sinchon-lecture'
              >[강의자료]</a>
            </li>
            <li>
              신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 콘테스트 중급
              출제진&nbsp;<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/948'
              >[대회 페이지]</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>
            서강대학교 컴퓨터공학과 알고리즘 문제해결 학회 Sogang ICPC
            Team&nbsp;<a target='_blank' href='https://icpc.team/'
            >[홈페이지]</a>
          </h3>
          <p className='text-muted'>2020 - 2022</p>
          <ul>
            <li>2022 학회 임원진 활동</li>
            <li>
              서강대학교 프로그래밍 경진대회(SPC) 운영진&nbsp;<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/897'
              >[대회 페이지]</a>
            </li>
            <li>
              서강대학교 청정수컵 출제진/운영진&nbsp;<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/796'
              >[대회 페이지]</a>
            </li>
            <li>학회 내 알고리즘 문제 풀이 스터디를 2년간 운영</li>
          </ul>
        </section>
        <section>
          <h3>
            오픈 컨퍼런스 BBConf&nbsp;<a
              target='_blank'
              href='https://bbconf.kr/'>[홈페이지]</a>&nbsp;<a target='_blank' href='https://bbconf.kr/archive'
            >[발표자료 아카이브]</a>
          </h3>
          <p className='text-muted'>2020 - 현재</p>
          <ul>
            <li>&apos;마녀&apos;라는 닉네임으로 컨퍼런스 발표</li>
            <li>
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf'
              >&apos;블로그로 진짜 개발자처럼 보이는 법&apos;</a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf'
              >&apos;JS는 왜 이 모양 이 꼴일까?&apos;</a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2021-winter/%5B%EB%A7%88%EB%85%80%5D%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%EC%BD%94%EB%93%9C%20%EC%97%90%EB%94%94%ED%84%B0%20%EC%A0%9C%EC%9E%91%EA%B8%B0.pdf'
              >&apos;텍스트 에디터 제작기&apos;</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>GDSC Hongik 발표</h3>
          <ul>
            <li>
              <a
                target='_blank'
                href='https://www.youtube.com/watch?v=RXpOaKQES-g'
              >&apos;내가 소프트웨어 마에스트로에서 배운 것들&apos;</a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://www.instagram.com/p/C6qXQwvBEOb/?img_index=2'
              >&apos;어떤 개발자가 되고 싶나요?&apos;</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>작업 기록</h3>
          <ul>
            <li>
              <a
                target='_blank'
                href='https://witch.work/posts/project-backend-gcp-deploy'
              >
                Google Cloud Platform을 이용한 백엔드 배포 일지
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://witch.work/posts?search=%EC%BA%90%EB%A1%9C%EC%85%80'
              >
                사이트 디자인에 맞게 캐로셀 컴포넌트를 제작한 경험에 대해 작성
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://witch.work/posts?search=%ED%83%90%EA%B5%AC%EC%83%9D%ED%99%9C'
              >
                JavaScript와 TypeScript의 명세, 구동 방식, 역사 등에 대하여 약
                40개의 글 작성
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://witch.work/posts?search=%EB%B8%94%EB%A1%9C%EA%B7%B8'
              >
                블로그 제작 과정과 마주한 결정들, 사용한 라이브러리 등에 대해 약
                30개의 글 작성
              </a>
            </li>
          </ul>
        </section>
      </section>
      <section>
        
        <h2>수상</h2>
        <section>
          <h3>신촌지역 대학교 프로그래밍 동아리 연합</h3>
          <ul>
            <li>
              2022 겨울 신촌지역 대학교 프로그래밍 동아리 연합 대회
              5등(팀명:&nbsp;ECM)
            </li>
            <li>
              2021 여름 신촌지역 대학교 프로그래밍 동아리 연합 대회
              9등(팀명:&nbsp;ECM)
            </li>
            <li>
              2021 여름 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프
              콘테스트 초급 3등
            </li>
          </ul>
        </section>
        <section>
          <h3>
            전국 대학생 프로그래밍 대회 동아리 연합&nbsp;<a
              target='_blank'
              href='https://ucpc.me/'
            >[홈페이지]</a>
          </h3>
          <ul>
            <li>2022년 여름 대회 본선 진출(팀명:&nbsp;축하합니다 김준호)</li>
          </ul>
        </section>
      </section>
      <section>
        <h2>교육</h2>
        <section>
          <h3>서강대학교 기계공학과/컴퓨터공학과</h3>
          <p className='text-muted'>2015.03 - 2023.02</p>
          <ul>
            <li>컴퓨터공학 전공학점 4.03/4.3</li>
          </ul>
        </section>
      </section>
      <section>
        <h2>외국어</h2>
        <ul>
          <li>OPIc(영어) IM2(2023.03.10)</li>
        </ul>
      </section>
    </div>
  );
}

export default ResumeKOR;