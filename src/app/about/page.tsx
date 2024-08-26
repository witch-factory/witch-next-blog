import Image from 'next/image';

import * as styles from './styles.css';

function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.marginBottom}>김성현(Kim Sung Hyun)</h1>
      <p>
        프론트엔드 개발자입니다. 온라인에서는 &quot;마녀&quot;라는 닉네임을 주로 사용합니다.
      </p>
      <section>
        <div className={styles.introBox}>
          <div className={styles.mobileHidden}>
            <Image width={120} height={120} style={{ margin:'0 auto' }} src='/witch-new-hat.png' alt='제가 심볼로 사용하는 마녀 모자' />
            <p>제가 심볼로 흔히 사용하는 마녀 모자입니다.</p>
          </div>
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
            <li>
              <a target='_blank' href='https://witch.work/resume/kor'>이력서 링크</a>
            </li>
          </ul>
        </div>
      </section>
      <section>
        <h2>소개</h2>
        <p>
          저는 기계공학을 전공했습니다. 기계공학을 좋아하지는 않았습니다. 그러던 어느 날 우연히 몇몇 개발자들을 만났습니다. 그들은 단 1초의 망설임도 없이 자신의 일을 사랑한다고 말했습니다. 그런 열정과 확신에 찬 그들의 눈빛은 제가 보기엔 따라가야만 할 북극성처럼 빛났습니다. 저는 그렇게 개발자가 되었습니다.
        </p>
        <p>
         그렇게 멋진 사람들이 온몸으로 내는 별빛을 따라 여기까지 왔습니다. 근본적인 기술에 파고들었고 많은 이들이 쉽게 다가가지 않는 깊은 지식의 탐구를 사랑하게 되었습니다. 실력을 키워 몇 개의 프로젝트를 했고, 개발자로 취직을 했습니다. 수백 개의 글을 작성하여 그럭저럭 검색 결과에 뜨는 블로그를 운영하게 되었습니다.
        </p>
        <p>
          이제 저는 별에 좀 더 가까워졌을까요? 꿈같던 자리에 제가 있기도 했습니다. 절대 닿을 수 없을 하늘의 별처럼 빛나던 사람들 중 몇몇은 제 옆에서 달리는 친구가 되었습니다. 어쩌면 제가 조금은 하늘로 날아올랐을지도 모르겠습니다.
        </p>
        <p>
          저는 앞으로도 계속 빛나는 사람들을 좇고 깊은 지식을 탐구하고 새로운 길을 개척하려 노력할 겁니다. 사람들과 함께 나아가고 조금 더 위로 날아오르고, 할 수 있는 것을 하면서, 저도 별처럼 빛나길 꿈꿉니다. 언젠가는 저도 &quot;마녀&quot;라는 닉네임처럼, 코드로 마법을 부릴 수 있을지도 모릅니다.
        </p>
        <p>
          이곳에 찾아오신 당신에게도 그 편린을 보여드릴 수 있어 영광입니다.
        </p>
    
      </section>
      
      <section>
        <h2>관심사</h2>
        <section>
          <h3>알고리즘</h3>
          <ul>
            <li>
            알고리즘을 풀며 프로그래밍을 처음 시작했고 오랫동안 활동했으며 나름의 신념과 열정을 가지고 있습니다.
            </li>
            <li>
            2개의 계정을 합쳐 약 2000문제를 해결하였고 solved.ac 기준 상위 1%내에 드는 레이팅을 가지고 있습니다.
            </li>
            <li>
            첫번째 계정 : <a target='_blank' href='https://solved.ac/profile/city'>city(Diamond IV)</a>
            </li>
            <li>
            두번째 계정 : <a target='_blank' href='https://solved.ac/profile/dart'>dart(Platinum III)</a>
            </li>
          </ul>
        </section>
        <section>
          <h3>JavaScript, TypeScript</h3>
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
      </section>

    </div>
  );
}

export default AboutPage;
