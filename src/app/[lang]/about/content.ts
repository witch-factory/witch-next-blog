import { blogConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';

export const aboutContent = {
  ko: {
    name: '김성현',
    description: '온라인에서는 "마녀"라는 닉네임과 아래 심볼을 주로 사용합니다.',
    symbolInfo: '마녀 모자 심볼',
    links: [
      { name: '블로그', url: 'https://witch.work' },
      { name: 'GitHub', url: 'https://github.com/witch-factory' },
      { name: '이메일', url: `mailto:${blogConfig.email}` },
      { name: '이력서', url: '/resume' },
    ],
    introduction: {
      title: '소개',
      paragraphs: ['제가 보았던 가장 멋진 사람들을 따라왔습니다. 사랑하는 걸 위해 인생을 던져봤습니다. 이제야 믿고 싶은 게 조금은 생겼습니다. 이 길을 따라 계속 가다 보면 언젠가 마술같은 일을 해낼지도 모른다는 꿈을 꿉니다.'],
    },
  },
  en: {
    name: 'Sung Hyun Kim',
    description: 'Online, I mostly go by the nickname "Witch" and use the symbol below.',
    symbolInfo: 'Witch Hat Symbol',
    links: [
      { name: 'Blog', url: 'https://witch.work/en' },
      { name: 'GitHub', url: 'https://github.com/witch-factory' },
      { name: 'Email', url: `mailto:${blogConfig.email}` },
      { name: 'Resume', url: '/resume' },
    ],
    introduction: {
      title: 'Introduction',
      paragraphs: ['I have followed the most wonderful people I have ever seen. I threw my life into what I love. Only now have I found a few things I want to believe in. I dream that if I keep walking this path, someday I might do something like magic.'],
    },
  },
} as const satisfies Record<Locale, object>;
