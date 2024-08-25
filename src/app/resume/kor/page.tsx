import * as styles from '../resumeStyle.css';

function ResumeKOR() {
  return (
    <div className={styles.container}>
      <h1>김성현 (Kim Sung Hyun)</h1>
      <hr />
      <p>
      프론트엔드 개발자입니다. 기계공학을 전공하던 중 자신의 일을 사랑한다고 단 1초도 망설임없이 말할 수 있는 열정적인 사람들을 만났고, 그들에게 마음이 끌려 개발자가 되었습니다. 그런 사람들과 함께 개발을 통해 문제를 해결하고 원리를 탐구하는 것을 즐겨 왔으며 앞으로도 그렇게 살고자 합니다.
      </p>
      <section>
        <h2>정보</h2>
        <ul>
          <li>
          Blog : <a target='_blank' href='https://witch.work'>https://witch.work</a>
          </li>
          <li>
          GitHub : <a target='_blank' href='https://github.com/witch-factory'>https://github.com/witch-factory</a>
          </li>
          <li>
            contact
            <address>
              Email : <a target='_blank' href='mailto:soakdma37@gmail.com'>soakdma37@gmail.com</a>
              <br />
              Phone : <a target='_blank' href='tel:+821076769194'>010-7676-9194</a>
            </address>
          </li>
        </ul>
      </section>
      <section>
        <h2>프로젝트</h2>
        <section>
          <h3>Tmax FinAI 재직(2023.08~)</h3>
          <hr />
          <h4>배달서비스공제조합 관리자 서비스(2023.08~2024.03)</h4>
          <ul>
            <li>기술: React, TypeScript, styled-components, React Hook Form, React Query</li>
            <li>배달서비스공제조합의 보험 보상금 관리 페이지, 보험 가입자를 위한 서비스 페이지를 구현하였습니다.</li>
            <li>time picker, 다양한 형식의 카드 등 공통 컴포넌트들을 요구사항에 따라 구현하였습니다.</li>
          </ul>
        </section>
        <section>
          <h3>신촌지역 대학생 프로그래밍 동아리 연합 프로그램 관리(2024.05~)</h3>
          <hr />
          <ul>
            <li>신촌지역 대학교들의 프로그래밍 동아리 연합에서 필요한 프로그램들을 만들고 관리하는 팀의 팀장을 맡았습니다.</li>
            <li>연합의 홈페이지와 연합에서 운영하는 알고리즘 캠프의 출석 관리를 해주고 강의료 환급을 계산하는 관리자 페이지를 관리하였습니다.</li>
            <h4>프론트엔드</h4>
            <ul>
              <li>기술: Next.js, TypeScript, styled-components, Radix UI, swr, axios</li>
              <li>Next.js 10 버전으로 되어 있던 홈페이지와 관리자 페이지를 Next.js 12로 마이그레이션하였으며 Javascript 기반 코드를 Typescript로 변경했습니다.</li>
              <li>기존 코드를 작성한 분을 찾아 논의하고 기능을 해치지 않는 선에서 코드를 리팩토링하였습니다.</li>
              <li>DOM API 기반으로 짜였던 기존 이벤트 핸들러를 React hook 기반으로 재작성하였습니다.</li>
              <li>사용되지 않는 기능 때문에 복잡해져 있었던 공통 컴포넌트들을 Radix UI 컴포넌트를 사용하여 빠르게 개선하였습니다.</li>
            </ul>
            <h4>백엔드</h4>
            <ul>
              <li>기술: Express, prisma, Google Cloud Platform, Vitest</li>
              <li>동아리 참여 경험을 바탕으로 팀원들과 함께 현재 동아리에서 필요한 데이터를 기반으로 DB 테이블을 재설계하였습니다.</li>
              <li>Go와 raw query 기반으로 되어 있었던 기존 코드를 팀원들의 경험을 고려하여 Node.JS, Typescript, Prisma ORM 기반으로 재작성하였습니다.</li>
              <li>디스코드로 진행되는 비대면 강의의 출석을 위해 discord.js 라이브러리를 이용해 출석 봇을 만들고 배포하며 timezone 이슈를 해결하였습니다.</li>
              <li><a target='_blank' href='https://witch.work/posts/project-backend-gcp-deploy'>백엔드 서버를 Google Cloud Platform을 통해 배포하고 기록하였습니다.</a></li>
            </ul>
          </ul>
        </section>
        <section>
          <h3>개인 블로그 제작(2023.05~)</h3>
          <small
          >Next.js를 기반으로 반응형의 개인 블로그를 제작하였습니다.</small
          >
          <hr />
          페이지 링크 :
          <a target='_blank' href='https://witch.work/'> https://witch.work </a>
          <br />
          GitHub 링크 :
          <a
            target='_blank'
            href='https://github.com/witch-factory/witch-next-blog'
          > https://github.com/witch-factory/witch-next-blog
          </a>
          <ul>
            <li>기술: Next.js, TypeScript, vanilla-extract</li>
            <li>
              remark 플러그인을 작성하여 TOC 생성, 이미지 경로 수정, canvas를
              이용한 글 썸네일 자동 생성 등을 구현하였습니다.
            </li>
            <li>
                글 검색 기능과 디바운싱 최적화, 서버리스 DB를 사용한 조회수 카운터 등을 구현하였습니다.
            </li>
            <li>
              런타임 연산 최적화, DOM Tree 축소, 압축과 CDN을 이용한
              이미지 서빙 속도 개선, 배포 서버 개선 등을 통해 lighthouse 성능
              점수를 20점 이상 향상시켰습니다.
            </li>
            <li>
              이후에도 Next.js 13의 RSC로 마이그레이션, 유지보수되지 않는
              라이브러리 변경, 버전 업데이트에 따른 코드 수정 등의 이슈를
              해결하였습니다.
            </li>
            <li>
              모든 결정에 이유를 붙일 수 있는 코드를 작성하고자 했으며 그 과정을
              <a
                target='_blank'
                href='https://witch.work/posts?search=%EB%B8%94%EB%A1%9C%EA%B7%B8'
              >블로그에 정리</a>하였습니다.
            </li>
            <li>
              이후에도 블로그에 지속적으로 기술 관련 글을 작성하고 있으며 약
              200개의 글을 작성하였습니다.
            </li>
          </ul>
        </section>
        <section>
          <h3>밴드웨건 / 소프트웨어 마에스트로 13기(2022.07~2022.11)</h3>
          <small
          >사회인 밴드의 활동을 돕는 플랫폼 &quot;밴드웨건&quot;을 개발했습니다.</small>
          <hr />
          GitHub 링크 :
          <a
            target='_blank'
            href='https://github.com/swm-broccoli/bandwagon-frontend-revise'
          > https://github.com/swm-broccoli/bandwagon-frontend-revise</a
          >
          <ul>
            <li>기술: React, Typescript, zustand, TailwindCSS</li>
            <li>
              React와 TailwindCSS를 사용하여 약 10개의 페이지를 반응형
              레이아웃으로 제작하였습니다.
            </li>
            <li>
              사이트의 디자인에 맞게 캐로셀 컴포넌트를 직접 제작하고 그 과정을
              <a
                target='_blank'
                href='https://witch.work/posts?search=%EC%BA%90%EB%A1%9C%EC%85%80'
              >블로그에 작성</a
              >하였습니다.
            </li>
            <li>
              서버 통신에서의 경쟁 상태를 해결하고 그 과정을
              <a target='_blank' href='https://witch.work/posts/front-bug-1'
              >블로그에 작성</a
              >하였습니다.
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h2>활동</h2>
        <section>
          <h3>Javascript 관련 활동</h3>
          <small>Javascript에 관심이 많고 깊이 탐구하는 것을 즐깁니다.</small>
          <hr />
          <ul>
            <li>
              <a
                target='_blank'
                href='https://witch.work/posts?search=%ED%83%90%EA%B5%AC%EC%83%9D%ED%99%9C'
              >
                JavaScript와 TypeScript의 명세, 구동 방식, 역사 등에 대하여 약
                40개의 글을 작성하였고 꾸준히 탐구하고 기록하고 있습니다.
              </a>
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4'
              >
                &quot;JS의 주석은 //과 /* */뿐만이 아니다&quot;라는 글로 네이버 FE News
                2024년 2월 큐레이션에 선정되었습니다.
              </a>
            </li>
            <li>
              <a
                href='https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory'
              >MDN 영문 문서에 사실과 틀린 점이 적혀 있는 점을 찾아 고치고
                기여하였습니다.</a
              >
            </li>
            <li>
              <a
                href='https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory'
              >MDN에서 많은 도움을 받았던 영문 문서들의 한글 번역을
                진행하였습니다.</a
              >
            </li>
            <li>
              <a
                target='_blank'
                href='https://github.com/WebKit/WebKit/pull/25696'
              >
                WebKit JavascriptCore 엔진 주석의 표기에서 발견한 잘못된 부분에
                기여하였습니다.
              </a>
            </li>
            <li>
              <a target='_blank' href='https://js-history.vercel.app/'
              >Javascript의 역사에 관해 Javascript 핵심 기여자들이 작성한 약
                120쪽 분량의 문서를 개인적으로 번역하였습니다.</a
              >
            </li>
          </ul>
        </section>
        <section>
          <h3>
            신촌지역 대학교 프로그래밍 동아리 연합(<a
              target='_blank'
              href='https://icpc-sinchon.io/suapc'
            >링크</a>)
          </h3>
          <small
          >신촌지역 5개 대학의 프로그래밍 동아리 연합에서
            활동하였습니다.</small>
          <hr />
          <ul>
            <li>
              100명 규모의 2022 겨울 신촌지역 대학교 프로그래밍 동아리 연합
              알고리즘 캠프 초급반 강사 활동(<a
                target='_blank'
                href='https://github.com/witch-factory/2022-winter-sinchon-lecture'
              >강의자료 링크</a>)
            </li>
            <li>
              2023 겨울 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프
              콘테스트 중급 출제진(<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/948'
              >대회 링크</a>)
            </li>
          </ul>
        </section>
        <section>
          <h3>
            서강대학교 컴퓨터공학과 알고리즘 문제해결 학회 Sogang ICPC Team(<a
              target='_blank'
              href='https://icpc.team/'
            >링크</a>)
          </h3>
          <hr />
          <ul>
            <li>2022년 학회 최초로 복수전공 임원으로 활동</li>
            <li>
              2022 서강대학교 프로그래밍 경진대회(SPC) 운영진(<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/897'
              >대회 링크</a>)
            </li>
            <li>
              2022 서강대학교 청정수컵 출제진/운영진(<a
                target='_blank'
                href='https://www.acmicpc.net/contest/view/796'
              >대회 링크</a>)
            </li>
            <li>2020~2022 학회 내 알고리즘 문제 풀이 스터디 운영</li>
          </ul>
        </section>
        <section>
          <h3>
            BBConf(<a target='_blank' href='https://bbconf.kr/'>링크</a>)
          </h3>
          <small
          >오픈카톡방 커뮤니티에서 시작한 오픈 컨퍼런스 BBConf에서 꾸준히
            발표하고 있습니다.</small>
          <hr />
          <ul>
            <li>
              &apos;마녀&apos;라는 닉네임으로 2020년부터 컨퍼런스에 참석하였고
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf'
              >&apos;블로그로 진짜 개발자처럼 보이는 법&apos;</a
              >,
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf'
              >&apos;JS는 왜 이 모양 이 꼴일까?&apos;</a
              >,
              <a
                target='_blank'
                href='https://bbconfwebdav.vulcan.site/bbconf/2021-winter/%5B%EB%A7%88%EB%85%80%5D%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98%EC%9D%84%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%EC%BD%94%EB%93%9C%20%EC%97%90%EB%94%94%ED%84%B0%20%EC%A0%9C%EC%9E%91%EA%B8%B0.pdf'
              >&apos;텍스트 에디터 제작기&apos;</a
              >등의 주제를 발표하였습니다.
            </li>
            <li>
              발표자료 아카이브 :
              <a target='_blank' href='https://bbconf.kr/archive'
              >https://bbconf.kr/archive</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>
            GDSC Hongik(<a target='_blank' href='https://www.gdschongik.com/'
            >링크</a>)
          </h3>
          <small
          >홍익대학교의 개발 학회 GDSC Hongik에서 주관하는 DevTalk Seminar에서
            외부 발표자로 발표하였습니다.</small>
          <hr />
          <ul>
            <li>
              &apos;내가 소프트웨어 마에스트로에서 배운 것들&apos;이라는 주제로,
              프로젝트를 진행할 때 고려해야 할 사항들에 대해 발표하였습니다(<a
                target='_blank'
                href='https://www.youtube.com/watch?v=RXpOaKQES-g'
              >발표 영상</a>).
            </li>
            <li>
            &apos;어떤 개발자가 되고 싶나요?&apos;라는 주제로 개발자로서 마주하는 여러
              결정과 고려해야 할 사항들에 대해 발표하였습니다(<a
                target='_blank'
                href='https://www.instagram.com/p/C6qXQwvBEOb/?img_index=2'
              >발표 포스터</a>).
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h2>수상</h2>
        <section>
          <h3>
            신촌지역 대학교 프로그래밍 동아리 연합(<a
              target='_blank'
              href='https://icpc-sinchon.io'
            >링크</a>)
          </h3>
          <small
          >신촌지역 5개 대학의 동아리 연합에서 주최한 알고리즘 문제풀이 대회
            수상 내역입니다.</small>
          <hr />
          <ul>
            <li>
              2022 신촌지역 대학교 프로그래밍 동아리 연합 겨울 대회 5등(팀명 :
              ECM)
            </li>
            <li>
              2021 신촌지역 대학교 프로그래밍 동아리 연합 여름 대회 9등(팀명 :
              ECM)
            </li>
            <li>
              2021 여름 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프
              콘테스트 초급 3등
            </li>
          </ul>
        </section>
        <section>
          <h3>
            전국 대학생 프로그래밍 대회 동아리 연합(<a
              target='_blank'
              href='https://ucpc.me/'
            >링크</a>)
          </h3>
          <small
          >전국 대학생 프로그래밍 대회 동아리 연합에서 주최한 알고리즘
            문제풀이 대회의 내역입니다.</small>
          <hr />
          <ul>
            <li>2022년 여름 대회 본선 진출(팀명 : 축하합니다 김준호)</li>
          </ul>
        </section>
      </section>
      <section>
        <h2>교육</h2>
        <section>
          <h3>서강대학교 기계공학과/컴퓨터공학과</h3>
          <hr />
          <ul>
            <li>2015.03 ~ 2023.02</li>
            <li>컴퓨터공학 전공학점 4.03/4.3</li>
            <li>
            자료구조, 데이터베이스시스템, 알고리즘설계분석, 컴퓨터아키텍처, 기초컴퓨터네트워크, 운영체제 등의 CS 과목을 수강하였습니다.
            </li>
            <li>
            운영체제 과목을 수강하며 관련 내용과 과제를 수행한 과정을 <a target='_blank' href='https://witch.work/posts?search=%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C'>블로그에 정리</a>하였습니다.
            </li>
          </ul>
        </section>
      </section>
      <section>
        <h2>외국어</h2>
        <ul className={styles.marginBottom}>
          <li>
            OPIc(영어) IM2(2023.03.10)
          </li>
        </ul>
      </section>
    </div>
  );
}

export default ResumeKOR;