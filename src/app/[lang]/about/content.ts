import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';

export const aboutContent = {
  ko: {
    name: '김성현',
    description: '프론트엔드 개발자입니다. 온라인에서는 "마녀"라는 닉네임을 주로 사용합니다.',
    symbolInfo: '제가 심볼로 흔히 사용하는 마녀 모자입니다.',
    links: [
      { name: '블로그', url: 'https://witch.work' },
      { name: 'GitHub', url: 'https://github.com/witch-factory' },
      { name: '이메일', url: `mailto:${blogConfig.ko.email}` },
      { name: '이력서', url: '/resume/kor' },
    ],
    introduction: {
      title: '소개',
      paragraphs: [
        '저는 기계공학을 전공했습니다. 기계공학을 좋아하지는 않았습니다. 그러던 어느 날 우연히 몇몇 개발자들을 만났습니다. 그들은 단 1초의 망설임도 없이 눈을 빛내면서, 자신의 일을 사랑한다고 말했습니다. 북극성처럼 빛나던 그들의 눈을 따라서 개발자가 되었습니다.',
        '그렇게 멋진 사람들이 내던 빛을 따라가다가 여기까지 왔습니다. 앞으로도 그렇게 살 수 있었으면 좋겠고, 저도 언젠가는 제가 보았던 별들처럼 빛나기를 꿈꿉니다. 이곳에 찾아오신 당신께도 제가 꾸는 꿈의 편린을 보여드릴 수 있어 영광입니다.',
      ],
    },
    interests: {
      title: '관심사',
      algorithms: {
        title: '알고리즘',
        items: [
          '알고리즘을 풀며 프로그래밍을 처음 시작했고 오랫동안 활동했으며 나름의 신념과 열정을 가지고 있습니다.',
          '2개의 계정을 합쳐 약 2000문제를 해결하였고 solved.ac 기준 상위 1%내에 드는 레이팅을 가지고 있습니다.',
        ],
        accounts: [
          { name: 'city(Diamond IV)', url: 'https://solved.ac/profile/city' },
          { name: 'dart(Platinum III)', url: 'https://solved.ac/profile/dart' },
        ],
      },
      javascript: {
        title: 'JavaScript, TypeScript',
        items: [
          { name: '"JS의 주석은 //과 /* */뿐만이 아니다" 네이버 FE News 2024년 2월 큐레이션 선정', url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4' },
          { name: 'MDN 영문 문서 오류 수정', url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory' },
          // TODO: 언젠가 MDN 번역을 더 많이 하고 나서 번역 이력 추기ㅏ
          { name: 'WebKit JavaScriptCore 엔진 코드의 주석 설명 수정', url: 'https://github.com/WebKit/WebKit/pull/25696' },
          { name: 'JavaScript의 역사에 관한 약 120쪽 분량의 논문 번역, 배포', url: 'https://js-history.vercel.app/' },
        ],
      },
    },
  },
  en: {
    name: 'Sung Hyun Kim',
    description: 'I am a frontend developer. Online, I often go by the nickname "Witch".',
    symbolInfo: 'This is the witch hat I commonly use as my symbol.',
    links: [
      { name: 'Blog', url: 'https://witch.work/en' },
      { name: 'GitHub', url: 'https://github.com/witch-factory' },
      { name: 'Email', url: `mailto:${blogConfig.ko.email}` },
      { name: 'Resume', url: '/resume/kor' },
    ],
    introduction: {
      title: 'Introduction',
      paragraphs: [
        'I majored in mechanical engineering. Actually, I didn’t like it very much. One day, I happened to meet some developers. Without a second of hesitation, their eyes sparkled as they spoke of their love for their work. Following the brilliance in their eyes like a guiding star, I became a developer.',
        'Following the light of those wonderful people, I’ve come this far. I hope to keep living this way, and I dream of shining like the stars I saw someday. It’s an honor to share a piece of my dream with you who have found this place.',
      ],
    },
    interests: {
      title: 'Interests',
      algorithms: {
        title: 'Algorithms',
        items: [
          'I started programming by solving algorithms, and I have been active in it for a long time with my own passion.',
          'I have solved about 2000 problems across two accounts, ranking within the top 1% on solved.ac.',
        ],
        accounts: [
          { name: 'city(Diamond IV)', url: 'https://solved.ac/profile/city' },
          { name: 'dart(Platinum III)', url: 'https://solved.ac/profile/dart' },
        ],
      },
      javascript: {
        title: 'JavaScript, TypeScript',
        items: [
          { name: '"Comments in JS are not just // and /* */", Featured in Naver FE News 2024.02', url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4' },
          { name: 'Fixed errors in MDN English documentation', url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory' },
          { name: 'Improved comments in the WebKit JavaScriptCore engine code', url: 'https://github.com/WebKit/WebKit/pull/25696' },
          { name: 'Translated and published a paper on the history of JavaScript', url: 'https://js-history.vercel.app/' },
        ],
      },
    },
  },
} as const satisfies Record<Language, object>;