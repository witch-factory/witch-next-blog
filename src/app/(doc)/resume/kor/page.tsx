import styles from '../styles.module.css';

function ResumeKOR() {
  return (
    <div className={styles.container}>
      <h1>김성현(Kim Sung Hyun)</h1>
      <hr />
      <p>
        프론트엔드 개발자입니다.
        자신의 일을 사랑한다고 단 1초도 망설임없이 말할 수 있는 열정적인 사람들을 좇다가 개발자가 되었습니다. 
        그리고 그들과 함께해 왔습니다. 앞으로도 그렇게 살고자 합니다.
      </p>
      <section>
        <h2>정보</h2>
        <ul>
          <li>
            blog : <a target='_blank' href='https://witch.work'>https://witch.work</a>
          </li>
          <li>
            github : <a target='_blank' href='https://github.com/witch-factory'>https://github.com/witch-factory</a>
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
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>개인 블로그 제작(2023.05~현재)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li className={styles.noMarker}>
            페이지 링크 : <a target='_blank' href='https://witch.work/'>
              https://witch.work
            </a>
          </li>
          <li className={styles.noMarker}>
            github 링크 : <a target='_blank' href='https://github.com/witch-factory/witch-next-blog'>
              https://github.com/witch-factory/witch-next-blog
            </a>
          </li>
          <li className={styles.noMarker}>
            <ul>
              <li>
                NextJS를 기반으로 반응형의 개인 블로그를 제작하였습니다.
              </li>
              <li>
                remark 플러그인을 작성하여 TOC 생성, 이미지 경로 수정, canvas를 이용한 글 썸네일 자동 생성 등을 구현하였습니다.
              </li>
              <li>
                글 검색 기능과 디바운싱 최적화, 서버리스 DB를 사용한 조회수 카운터 등을 구현하였습니다.
              </li>
              <li>
                연산 최적화, DOM Tree 축소, 압축과 CDN을 이용한 이미지 서빙 속도 개선 등을 통해 
                lighthouse 성능 점수를 20점 이상 향상시켰습니다.
              </li>
              <li>
                모든 결정에 이유를 붙일 수 있는 코드를 작성하고자 했으며 그 모든 과정을 
                <a target='_blank' href='https://witch.work/posts?search=%EB%B8%94%EB%A1%9C%EA%B7%B8'> 블로그에 정리</a>하였습니다.
              </li>
            </ul>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>밴드웨건 / 소프트웨어 마에스트로 13기(2022.07~2022.11)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li className={styles.noMarker}>
            github 링크 : <a target='_blank' href='https://github.com/swm-broccoli/bandwagon-frontend-revise'>
              https://github.com/swm-broccoli/bandwagon-frontend-revise
            </a>
          </li>
          <li className={styles.noMarker}>
            <ul>
              <li>
                사회인 밴드의 활동을 돕는 플랫폼 밴드웨건을 개발했습니다.
              </li>
              <li>
                React와 TailwindCSS를 사용하여 약 10개의 페이지를 반응형 레이아웃으로 제작하였습니다.
              </li>
              <li>
                사이트의 디자인에 맞게 캐로셀 컴포넌트를 직접 제작하고 그 과정을 <a target='_blank' href='https://witch.work/posts/dev/carousel-7'>블로그에 정리</a>하였습니다.
              </li>
              <li>
                서버 통신에서의 경쟁상태를 해결하고 그 과정을 <a target='_blank' href='https://witch.work/posts/dev/front-bug-1'>블로그에 정리</a>하였습니다.
              </li>
            </ul>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>터미널 텍스트 에디터 제작(2021.04~2021.06)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li className={styles.noMarker}>
            github 링크 : <a target='_blank' href='https://github.com/witch-factory/editor_project'>https://github.com/witch-factory/editor_project</a>
          </li>
          <li className={styles.noMarker}>
            <ul>
              <li>
                자료구조 수업에서 배운 지식을 활용하여 최적화한 터미널 기반의 텍스트 에디터를 제작하였습니다.
              </li>
              <li>
                Linux의 텍스트 모드 UI 라이브러리인 ncurses를 사용하여 기본적인 텍스트 편집 기능과 C, C++ 신택스 하이라이팅을 구현하였습니다.
              </li>
              <li>
                KMP 알고리즘을 활용하여 검색 최적화를 진행하였습니다.
              </li>
              <li>
                트라이 자료구조와 그래프 탐색을 이용하여 변수명/함수명 자동완성 기능을 구현하였습니다.
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <section>
        <h2>활동</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>GDSC Hongik(<a target='_blank' href='https://www.gdschongik.com/'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}>
            <small>홍익대학교의 개발 학회 GDSC Hongik에서 주관하는 DevTalk Seminar에서 외부 발표자로 발표하였습니다.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            '내가 소프트웨어 마에스트로에서 배운 것들'이라는 주제로, 프로젝트를 진행할 때 고려해야 할 사항들에 대해 발표하였습니다.
          </li>
          <li>
            발표 영상(GDSC Hongik 채널) : <a target='_blank' href='https://www.youtube.com/watch?v=RXpOaKQES-g'>https://www.youtube.com/watch?v=RXpOaKQES-g</a>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>신촌지역 대학교 프로그래밍 동아리 연합(<a target='_blank' href='https://icpc-sinchon.io/suapc'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}>
            <small>신촌지역 5개 대학의 동아리 연합에서 활동하였습니다.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            100명 규모의 2022 겨울 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 초급반 강사 활동(<a target='_blank' href='https://github.com/witch-factory/2022-winter-sinchon-lecture'>강의자료 링크</a>)
          </li>
          <li>
            2023 겨울 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 콘테스트 중급 출제진(<a target='_blank' href='https://www.acmicpc.net/contest/view/948'>대회 링크</a>)
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>서강대학교 컴퓨터공학과 알고리즘 문제해결 학회 Sogang ICPC Team(<a target='_blank' href='https://icpc.team/'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022년 학회 최초로 복수전공 임원으로 활동
          </li>
          <li>
            2022 서강대학교 프로그래밍 경진대회(SPC) 운영진(<a target='_blank' href='https://www.acmicpc.net/contest/view/897'>대회 링크</a>)
          </li>
          <li>
            2022 서강대학교 청정수컵 출제진/운영진(<a target='_blank' href='https://www.acmicpc.net/contest/view/796'>대회 링크</a>)
          </li>
          <li>
            2020~2022 학회 내 알고리즘 문제 풀이 스터디 운영
          </li>
          <li>
            <a href='https://solved.ac/profile/city'>solved.ac 레이팅 상위 1% 이내(Diamond V)</a>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>BBConf(<a target='_blank' href='https://bbconf.kr/'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}>
            <small>오픈카톡방 커뮤니티에서 시작한 오픈 컨퍼런스 BBConf에서 꾸준히 발표하고 있습니다.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            '마녀'라는 닉네임으로 2020년부터 컨퍼런스에 참석하였고 '텍스트 에디터 제작기', '소프트웨어 마에스트로 후기'등의 주제를 발표하였습니다.
          </li>
          <li>
            발표자료 아카이브 : <a target='_blank' href='https://bbconf.kr/archive'>https://bbconf.kr/archive</a>
          </li>
        </ul>
      </section>
      <section>
        <h2>수상</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>신촌지역 대학교 프로그래밍 동아리 연합(<a target='_blank' href='https://icpc-sinchon.io/suapc'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}>
            <small>신촌지역 5개 대학의 동아리 연합에서 주최한 대회 수상 내역입니다.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022 신촌지역 대학교 프로그래밍 동아리 연합 겨울 대회 5등(팀명 : ECM)
          </li>
          <li>
            2021 신촌지역 대학교 프로그래밍 동아리 연합 여름 대회 9등(팀명 : ECM)
          </li>
          <li>
            2021 여름 신촌지역 대학교 프로그래밍 동아리 연합 알고리즘 캠프 콘테스트 초급 3등
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>전국 대학생 프로그래밍 대회 동아리 연합(<a target='_blank' href='https://ucpc.me/'>링크</a>)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022년 여름 대회 본선 진출(팀명 : 축하합니다 김준호)
          </li>
        </ul>
      </section>
      <section>
        <h2>교육</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>서강대학교 기계공학과/컴퓨터공학과</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2015.03 ~ 2023.02 
          </li>
          <li>
            컴퓨터공학 전공학점 4.03/4.3
          </li>
          <li>
            자료구조, 데이터베이스시스템, 알고리즘설계분석, 컴퓨터아키텍처, 기초컴퓨터네트워크, 운영체제 등의 CS 과목을 수강하였습니다.
          </li>
          <li>
            운영체제 과목을 수강하며 관련 내용과 과제를 수행한 과정을 <a target='_blank' href='https://witch.work/posts?search=%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C'>블로그에 정리</a>하였습니다.
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>소프트웨어 마에스트로 13기</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022.07 ~ 2022.11
          </li>
          <li>
            브로콜리 소마저 팀 팀장/프론트엔드 개발 담당
          </li>
        </ul>
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