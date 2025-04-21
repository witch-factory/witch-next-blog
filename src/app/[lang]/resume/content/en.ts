import { ResumeContent } from '@/types/resume';

export const enResumeContent: ResumeContent = {
  name: 'SungHyun Kim',
  tagline: 'Inspired by the coolest, I became a developer.',
  contact: [
    {
      label: 'Blog',
      text: 'https://witch.work',
      url: 'https://witch.work',
    },
    {
      label: 'GitHub',
      text: 'https://github.com/witch-factory',
      url: 'https://github.com/witch-factory',
    },
    {
      label: 'Email',
      text: 'soakdma37@gmail.com',
      url: 'mailto:soakdma37@gmail.com',
    },
  ],
  summary:
    'I strive to understand legacy systems in context and make better decisions based on that. I’ve written about 200 articles on technical decisions and learning, always aiming to reflect that knowledge in code. While pursuing technical depth, I also build automation tools to improve team productivity, helping the team focus on what really matters.',
  career: [
    {
      title: 'Tmax FinAI',
      description: 'A web platform for insurance-related operations at Delivery Service Cooperative Association',
      tech: 'React, TypeScript, styled-components, React Hook Form, React Query',
      period: '08 2023 - 09 2024',
      role: 'Frontend Engineer',
      details: [
        {
          title: 'Developed utilities to improve team productivity and development environment',
          items: [
            { type: 'string', content: 'Built a tool to automate documentation of insurance terms used in API specs, reducing documentation time' },
            { type: 'string', content: 'Developed a verification tool to compare input data with a glossary of insurance terms and shared it with the team' },
            { type: 'string', content: 'Created custom hooks with React Query to handle WebSocket-based internal server APIs and shared with the team' },
          ],
        },
        {
          title: 'Implemented client-facing pages according to business requirements',
          items: [
            { type: 'string', content: 'Built pages for claim details, medical bill lookups, and emergency dispatch information' },
            { type: 'string', content: 'Implemented step-by-step insurance subscription process UI and error handling' },
            { type: 'string', content: 'Developed common UI components including tabs, radio buttons, progress bars, and chips' },
            { type: 'string', content: 'Implemented a custom time picker based on HTML time input behavior for specific client needs' },
          ],
        },
      ],
    },
  ],
  project: [
    {
      title: 'Personal Blog Development',
      description: 'A multilingual personal blog built with Next.js',
      tech: 'Next.js, TypeScript, Vanilla-extract',
      period: 'May 2023 - Present',
      role: 'Blog Owner & Developer',
      links: [
        { text: 'Live Site', url: 'https://witch.work/' },
        { text: 'GitHub', url: 'https://github.com/witch-factory/witch-next-blog' },
      ],
      details: [
        {
          title: 'Blog Implementation',
          items: [
            { type: 'string', content: 'Built the blog with Next.js 12 and updated to Next.js 13 using Server Components' },
            { type: 'string', content: 'Developed remark plugins to auto-generate TOC and transform image paths in markdown' },
            { type: 'string', content: 'Implemented OG image generator, site metadata, sitemap, and RSS feed for SEO' },
            {
              type: 'note-link',
              content: 'Configured and adopted ESLint 9',
              note: { text: 'Post link', url: 'https://witch.work/ko/posts/blog-eslint-configuration' },
            },
          ],
        },
        {
          title: 'Improving User Experience',
          items: [
            {
              type: 'note-link',
              content: 'Implemented automatic translation and multilingual support using AI',
              note: { text: 'Post link', url: 'https://witch.work/ko/posts/blog-auto-translation' },
            },
            {
              type: 'note-link',
              content: 'Auto-detected browser language and optimized SEO',
              note: { text: 'Post link', url: 'https://witch.work/ko/posts/blog-content-i18n' },
            },
            { type: 'string', content: 'Optimized code to improve lighthouse performance score by over 20 points' },
            { type: 'string', content: 'Implemented a debounced blog search page' },
          ],
        },
      ],
    },
    {
      title: 'ICPC Sinchon University Programming Club Alliance',
      description: 'Revamped the homepage and admin panel used for managing an algorithm camp',
      tech: 'Next.js, TypeScript, Radix UI, Express, Prisma, Google Cloud Platform',
      period: 'May 2024 - Dec 2024',
      role: 'Program Director',
      links: [
        { text: 'Website', url: 'https://icpc-sinchon.io' },
      ],
      details: [
        {
          title: 'Frontend Development',
          items: [
            { type: 'string', content: 'Migrated codebase from Next.js 10 + JavaScript to Next.js 12 + TypeScript' },
            { type: 'string', content: 'Refactored code after discussing with the original author to improve scalability' },
            { type: 'string', content: 'Rewrote DOM-heavy code in React for maintainability' },
            { type: 'string', content: 'Replaced shared components with Radix UI and removed unused features' },
          ],
        },
        {
          title: 'Backend Development',
          items: [
            { type: 'string', content: 'Built API server for student management, attendance, assignment checks, and payment tracking' },
            { type: 'string', content: 'Rewrote Golang-based raw query logic into Node.js with TypeScript and Prisma ORM' },
            { type: 'string', content: 'Implemented Discord attendance bot with discord.js and deployed alongside server' },
          ],
        },
      ],
    },
  ],
  presentation: [
    {
      title: 'BBConf',
      description: 'An open conference where participants share useful knowledge they’ve learned',
      period: '2021 - Present',
      role: 'Speaker, Attendee',
      links: [
        { text: 'Website', url: 'https://bbconf.kr/' },
        { text: 'Talk Archive', url: 'https://bbconf.kr/archive' },
      ],
      details: [
        {
          items: [
            { type: 'string', content: 'Gave talks under the nickname \"witch\"' },
            {
              type: 'link',
              content: {
                text: 'What really happens when you type google.com in your browser',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf',
              },
            },
            {
              type: 'link',
              content: {
                text: 'How to look like a real developer through blogging',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf',
              },
            },
            {
              type: 'link',
              content: {
                text: 'Why is JavaScript like this?',
                url: 'https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Geultto 10th Frontend Roundtable',
      description: 'A developer community for sharing and growing through tech blogging',
      role: 'Speaker, Member',
      period: '2025',
      links: [
        { text: 'Geultto Website', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            {
              type: 'link',
              content: {
                text: 'Starting Networking in My Own Way – Lessons from Over 30 Coffee Chats',
                url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'GDG on Campus Hongik Univ.',
      description: 'The largest IT student community at Hongik University',
      role: 'Speaker',
      period: '2023 - 2024',
      links: [
        { text: 'Website', url: 'https://www.gdschongik.com/' },
      ],
      details: [
        {
          items: [
            {
              type: 'link',
              content: {
                text: 'Lessons I learned from the SW Maestro program',
                url: 'https://www.youtube.com/watch?v=RXpOaKQES-g',
              },
            },
            {
              type: 'link',
              content: {
                text: 'What kind of developer do you want to become?',
                url: 'https://www.youtube.com/watch?v=SMMb56p7myg',
              },
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      title: 'B.S. in Mechanical and Computer Engineering, Sogang University',
      period: 'Mar 2015 - Feb 2023',
      items: [
        { type: 'string', content: 'GPA (Computer Engineering major): 4.03 / 4.3' },
      ],
    },
    {
      title: 'Software Maestro, 13th Class',
      period: 'Jul 2022 - Nov 2022',
      items: [
        { type: 'string', content: 'Developed \"Bandwagon\", a platform supporting amateur band activities' },
        { type: 'string', content: 'Used React, zustand, and Tailwind CSS' },
      ],
    },
  ],
  activity: [
    {
      title: 'Geultto 9–10th Generation – Technical Blog Writing',
      items: [
        {
          type: 'link',
          content: {
            text: '"JS comments are more than just // and /* */" – Featured in Naver FE News, Feb 2024',
            url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4',
          },
        },
        {
          type: 'link',
          content: {
            text: 'From Mathematical Dreams to JavaScript Star – The Journey of Closures',
            url: 'https://witch.work/ko/posts/javascript-closure-deep-dive-history',
          },
        },
        {
          type: 'link',
          content: {
            text: 'What is Variance in TypeScript?',
            url: 'https://witch.work/ko/posts/typescript-covariance-theory',
          },
        },
        {
          type: 'link',
          content: {
            text: 'Contributing to JavaScriptCore – Safari’s JavaScript Engine',
            url: 'https://witch.work/ko/posts/javascript-jscore-contribution',
          },
        },
      ],
    },
    {
      title: 'Open Source Contributions',
      items: [
        {
          type: 'link',
          content: {
            text: 'Fixed errors in MDN English docs',
            url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory',
          },
        },
        {
          type: 'link',
          content: {
            text: 'Translated MDN into Korean',
            url: 'https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory',
          },
        },
        {
          type: 'link',
          content: {
            text: 'Translated and published a 120-page paper on JavaScript history',
            url: 'https://js-history.vercel.app/',
          },
        },
      ],
    },
    {
      title: 'ICPC Sinchon University Programming Club Alliance',
      items: [
        {
          type: 'note-link',
          content: 'Instructor for Introductory Algorithm Camp (100+ students) in 2021',
          note: {
            text: 'Lecture Material',
            url: 'https://github.com/witch-factory/2022-winter-sinchon-lecture',
          },
        },
        {
          type: 'note-link',
          content: 'Organizing staff for Intermediate Algorithm Contest',
          note: {
            text: 'Contest Page',
            url: 'https://www.acmicpc.net/contest/view/948',
          },
        },
      ],
    },
    {
      title: 'Sogang ICPC Team',
      items: [
        {
          type: 'note-link',
          content: 'Organizer of Sogang Programming Contest (SPC)',
          note: {
            text: 'Contest Page',
            url: 'https://www.acmicpc.net/contest/view/897',
          },
        },
        {
          type: 'note-link',
          content: 'Organizer of Sogang Chungjeongsoo Cup',
          note: {
            text: 'Contest Page',
            url: 'https://www.acmicpc.net/contest/view/796',
          },
        },
        {
          type: 'string',
          content: 'Contributed as executive member in 2022 and ran algorithm study groups for two years',
        },
      ],
    },
  ],

  // presentation, education, activity would follow in similar structure and translated content.
};
