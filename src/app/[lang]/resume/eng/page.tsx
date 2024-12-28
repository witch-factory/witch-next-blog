import * as styles from '../resumeStyle.css';

function ResumeENG() {
  return (
    <div className={styles.container}>
      <h1>Kim Sung Hyun</h1>
      <hr />
      <p>
        One day I saw some developers saying, without any hesitation, they love their work. I was indeed inspired from their passion and decided to become a developer.
        I have been with them ever since and wish to pursue such brilliance for the following years as well.
      </p>
      <section>
        <h2>Info</h2>
        <ul className={styles.marginBottom}>
          <li>
            blog :
            {' '}
            <a href="https://witch.work">https://witch.work</a>
          </li>
          <li>
            github :
            {' '}
            <a href="https://github.com/witch-factory">https://github.com/witch-factory</a>
          </li>
          <li>
            contact
            <address>
              Email :
              {' '}
              <a href="mailto:soakdma37@gmail.com">soakdma37@gmail.com</a>
              <br />
              Phone :
              {' '}
              <a href="tel:+821076769194">(+82)010-7676-9194</a>
            </address>
          </li>
        </ul>
      </section>
      <section>
        <h2>Projects</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>Personal Blog(2023.05 ~ Current)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li className={styles.noMarker}>
            Page :
            {' '}
            <a target="_blank" href="https://witch.work/">
              https://witch.work
            </a>
          </li>
          <li className={styles.noMarker}>
            GitHub :
            {' '}
            <a target="_blank" href="https://github.com/witch-factory/witch-next-blog">
              https://github.com/witch-factory/witch-next-blog
            </a>
          </li>
          <li className={styles.noMarker}>
            <ul>
              <li>
                Built a personal blog with NextJS. It is responsive and has a dark mode.
              </li>
              <li>
                Wrote a remark plugin to generate TOC, modify image paths, and generate post thumbnails with canvas.
              </li>
              <li>
                Implemented search function, debouncing optimization for search, and serverless DB-based view counter.
              </li>
              <li>
                Improvement of Lighthouse performance score from 60~70 to 90~99 by optimizing computation and image optimization by compression, CDN and DOM tree reduction.
              </li>
              <li>
                Aimed to write code that had a reason for every decision.
                {' '}
                <a target="_blank" href="https://witch.work/posts?search=%EB%B8%94%EB%A1%9C%EA%B7%B8">And documented the entire process on my blog.</a>
              </li>
            </ul>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>BandWagon / SW Maestro 13th course(2022.07~2022.11)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li className={styles.noMarker}>
            GitHub :
            {' '}
            <a href="https://github.com/swm-broccoli/bandwagon-frontend-revise">https://github.com/swm-broccoli/bandwagon-frontend-revise</a>
          </li>
          <li className={styles.noMarker}>
            <ul>
              <li>
                Developed a platform &quot;bandwagon&quot; to help social bands stay active.
              </li>
              <li>
                Using React and TailwindCSS, created over 10 pages with responsive layouts.
              </li>
              <li>
                Built the carousel component myself to match the design of the site
                {' '}
                <a href="https://witch.work/carousel-1/">and blogged about the process.</a>
              </li>
              <li>
                Solved the race condition in server communication and
                {' '}
                <a href="https://witch.work/front-bug-1/">blogged about the process.</a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <section>
        <h2>Activities</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://www.gdschongik.com/">GDSC Hongik</a></h3>
          </li>
          <li className={styles.noMarker}>
            <small>Presented as an external speaker in the developer community in Hongik University, GDSC Hongik.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            On the topic &quot;What I learned from Software Maestro&quot;,
            talked about things to consider when working on a project in a team.
          </li>
          <li>
            Youtube record(GDSC Hongik channel) :
            {' '}
            <a href="https://www.youtube.com/watch?v=RXpOaKQES-g">https://www.youtube.com/watch?v=RXpOaKQES-g</a>
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://icpc-sinchon.io/suapc">Sinchon Regional University Programming Club Union</a></h3>
          </li>
          <li className={styles.noMarker}>
            <small>Active in the programming club association of five universities in the Sinchon region.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            Instructor for the 2022 Winter Algorithm Camp Novice class. About 100 student participated.(
            <a href="https://github.com/witch-factory/2022-winter-sinchon-lecture">Lecture material(Korean)</a>
            )
          </li>
          <li>
            Made problems for the 2023 Winter Algorithm Camp Contest for Intermediate.(
            <a href="https://www.acmicpc.net/contest/view/948">Contest link</a>
            )
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://icpc.team/">Sogang ICPC Team</a></h3>
          </li>
          <li className={styles.noMarker}>
            <small>Worked for problem solving club in Sogang University.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            Served as the club officer as double major student for the first time in the history of the club in 2022.
          </li>
          <li>
            2022 Sogang Programming Contest(SPC) Operator(
            <a href="https://www.acmicpc.net/contest/view/897">Contest link</a>
            )
          </li>
          <li>
            2022 Sogang University Clean Cup Contest Problem Setter/Operator(
            <a href="https://www.acmicpc.net/contest/view/796">Contest link</a>
            )
          </li>
          <li>
            Operated a problem solving study group in the club from 2020 to 2022.
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://bbconf.kr/">BBConf</a></h3>
          </li>
          <li className={styles.noMarker}>
            <small>Present at BBConf, an open conference started by the chatroom community.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            Attended the conference since 2020 under the nickname &apos;Witch&apos; and has presented on topics such as &apos;Making Terminal Text Editor&apos;, &apos;Software Maestro Review&apos;.
          </li>
          <li>
            Presentation Archive :
            {' '}
            <a href="https://bbconf.kr/archive">https://bbconf.kr/archive</a>
          </li>
        </ul>
      </section>
      <section>
        <h2>Awards</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://icpc-sinchon.io/suapc">Sinchon Regional University Programming Club Union</a></h3>
          </li>
          <li className={styles.noMarker}>
            <small>Awards in the programming club association of five universities in the Sinchon region.</small>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022 Winter Sinchon University Association Programming Contest 5th place(Team name : ECM)
          </li>
          <li>
            2021 Summer Sinchon University Association Programming Contest 9th place(Team name : ECM)
          </li>
          <li>
            2021 Summer ICPC Sinchon Algorithm Camp Contest 3rd place(Novice)
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3><a href="https://ucpc.me/">Union of Clubs for Programming Contests</a></h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022 Summer UCPC honorable mention(Team name : 축하합니다 김준호)
          </li>
        </ul>
      </section>
      <section>
        <h2>Education</h2>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>Sogang University Mechanical Engineering/Computer Science(Double Major)</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2015.03 ~ 2023.02
          </li>
          <li>
            Credits for Computer Science Majors 4.03/4.3
          </li>
        </ul>
        <ul className={styles.marginBottom}>
          <li className={styles.noMarker}>
            <h3>Software Maestro 13th course</h3>
          </li>
          <li className={styles.noMarker}><hr /></li>
          <li>
            2022.07 ~ 2022.11
          </li>
          <li>
            Team &quot;브로콜리 소마저&quot; leader/front-end developer
          </li>
        </ul>
      </section>
      <section>
        <h2>Language Skills</h2>
        <ul className={styles.marginBottom}>
          <li>
            OPIc(English) IM2(2023.03.10)
          </li>
        </ul>
      </section>
    </div>
  );
}

export default ResumeENG;
