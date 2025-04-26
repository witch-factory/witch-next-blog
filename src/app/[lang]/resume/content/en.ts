import { ResumeContent } from '@/types/resume';

export const enResumeContent: ResumeContent = {
  labels: {
    summary: 'Summary',
    career: 'Experience',
    project: 'Projects',
    education: 'Education',
    activity: 'Activities',
  },
  name: 'SungHyun Kim',
  tagline: 'I understand technology, articulate about it, and support my team.',
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
    'I\'m a developer who tries to understand the context of legacy code and make better decisions based on it. I\'ve written around 200 blog posts on technical choices and learning, and I try to apply those insights to real projects. I also build automation tools and shared utilities to reduce repetitive work, so the team can focus on what really matters.',
  career: [
    {
      title: 'Tmax FinAI',
      description: 'A web platform for insurance-related operations at Delivery Service Cooperative Association',
      tech: 'React, TypeScript, styled-components, React Hook Form, React Query',
      period: 'Aug 2023 - Sep 2024',
      role: 'Frontend Engineer',
      details: [
        {
          title: 'Developed utilities to improve team productivity and development environment',
          items: [
            { type: 'string', content: 'Built a tool to automate documentation of insurance terms used in API specs, reducing documentation time' },
            { type: 'string', content: 'Developed a verification tool to compare input data with a glossary of insurance terms and shared it with the team' },
            { type: 'string', content: 'Developed and shared React Query-based custom hooks to interface with internal WebSocket APIs' },
          ],
        },
        {
          title: 'Implemented pages to meet client requirements',
          items: [
            { type: 'string', content: 'Developed insurance application/processing pages and common UI components.' },
            { type: 'string', content: 'Built a custom time picker to meet specific client requirements.' },
          ],
        },
      ],
    },
  ],
  project: [
    {
      title: 'Personal Blog',
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
            { type: 'string', content: 'Built the blog using Next.js 12, maintaining and upgrading it to accommodate RSC updates.' },
            { type: 'string', content: 'Created custom remark plugins for generating TOC and automating image path rewriting within Markdown.' },
            { type: 'string', content: 'Enhanced SEO by implementing OG image generator, metadata management, sitemap, and RSS feed.' },
            { type: 'note-link', content: 'Introduced ESLint 9 Flat Config and documented the migration process.', note: { text: 'Article', url: 'https://witch.work/en/posts/blog-eslint-configuration' } },
          ],
        },
        {
          title: 'Improving User Experience',
          items: [
            { type: 'note-link', content: 'Built an AI-based automatic translation system to support English, improving global accessibility.', note: { text: 'Article', url: 'https://witch.work/ko/posts/blog-auto-translation' } },
            { type: 'note-link', content: 'Implemented automatic language switching and configured SEO for multilingual content.', note: { text: 'Article', url: 'https://witch.work/ko/posts/blog-content-i18n' } },
            { type: 'string', content: 'Optimized page performance, raising Lighthouse scores from 75 to 95.' },
          ],
        },
      ],
    },
    {
      title: 'Sinchon Univ. Programming Club Alliance',
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
            { type: 'string', content: 'Migrated the codebase from Next.js 10 + JavaScript to Next.js 12 + TypeScript.' },
            { type: 'string', content: 'Refactored legacy code through discussions with original authors, considering current needs and future scalability.' },
            { type: 'string', content: 'Replaced fragile DOM API-based code with React-based implementations for better maintainability.' },
            { type: 'string', content: 'Introduced Radix UI components to unify and streamline common elements.' },
          ],
        },
        {
          title: 'Backend Development',
          items: [
            { type: 'string', content: 'Developed an API server handling student management, attendance tracking, assignment submissions, and lecture fee calculations.' },
            { type: 'string', content: 'Migrated backend systems from Go and raw SQL to Node.js, TypeScript, and Prisma ORM for maintainability.' },
            { type: 'string', content: 'Built a Discord bot for online attendance tracking using discord.js and integrated it with the server.' },
          ],
        },
      ],
    },
  ],
  activity: [
    {
      title: 'Developer Writing Group, Geultto 9th-10th Cohort',
      description: 'Selected for 10 articles in a curation program with an acceptance rate below 5%, presented at a 100-attendee frontend developer gathering.',
      role: 'Presenter, Participant',
      period: '2023 - 2025',
      links: [
        { text: 'Website', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            { type: 'link', content: { text: 'Frontend Meetup Presentation - "Starting Networking My Way"', url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf' } },
            { type: 'link', content: { text: 'Selected by Naver FE News (Feb 2024) for an article about special comment formats in JavaScript.', url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4' } },
            { type: 'link', content: { text: 'Deep dive article tracing the history of closures from Turing machines to JavaScript.', url: 'https://witch.work/ko/posts/javascript-closure-deep-dive-history' } },
            { type: 'link', content: { text: 'Introduced velite, a content management library.', url: 'https://witch.work/ko/posts/velite-library-introduction' } },
            { type: 'link', content: { text: 'Explained type variance through TypeScript, selected in Geultto 9th term.', url: 'https://witch.work/ko/posts/typescript-covariance-theory' } },
          ],
        },
      ],
    },
    {
      title: 'BBConf',
      description: 'An open conference where participants share useful knowledge they’ve learned',
      period: '2021 - Present',
      role: 'Speaker, Attendee',
      links: [
        { text: 'Website', url: 'https://bbconf.kr/' },
      ],
      details: [
        {
          items: [
            { type: 'link', content: { text: 'Presentation: Clarifying common misconceptions in computer, network, and web history.', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf' } },
            { type: 'link', content: { text: 'Presentation: How to sustain blogging for the long term and write better articles.', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf' } },
            { type: 'link', content: { text: 'Presentation: The early history of JavaScript and its design decisions.', url: 'https://bbconfwebdav.vulcan.site/bbconf/2023-winter/%EB%A7%88%EB%85%80_JS%EB%8A%94_%EC%99%9C_%EC%9D%B4_%EB%AA%A8%EC%96%91%EC%9D%BC%EA%B9%8C.pdf' } },
          ],
        },
      ],
    },
    {
      title: 'Open Source Contributions',
      period: '2023 - Present',
      details: [
        {
          items: [
            { type: 'link', content: { text: 'Fixed historical errors in MDN English documents.', url: 'https://github.com/mdn/content/pulls?q=is%3Apr+author%3A%08witch-factory' } },
            { type: 'link', content: { text: 'Translated MDN legacy JavaScript documentation into Korean.', url: 'https://github.com/mdn/translated-content/pulls?q=is%3Apr+author%3A%08witch-factory' } },
            { type: 'link', content: { text: 'Translated and published a 120-page paper on the history of JavaScript.', url: 'https://js-history.vercel.app/' } },
          ],
        },
      ],
    },
    {
      title: 'Student Communities',
      period: '2021 - 2024',
      details: [
        {
          items: [
            { type: 'link', content: { text: 'Presentation at GDG on Campus Hongik Univ.: What I Learned from the SW Maestro Program.', url: 'https://www.youtube.com/watch?v=RXpOaKQES-g' } },
            { type: 'link', content: { text: 'Presentation at GDG on Campus Hongik Univ.: Setting Career Paths as a Developer.', url: 'https://www.youtube.com/watch?v=SMMb56p7myg' } },
            { type: 'note-link', content: 'Conducted a winter algorithm camp lecture for ~100 university students in Sinchon.', note: { text: 'Lecture Materials', url: 'https://github.com/witch-factory/2022-winter-sinchon-lecture' } },
            { type: 'note-link', content: 'Organized the Sogang Programming Contest (SPC) as part of the student committee.', note: { text: 'Contest Page', url: 'https://www.acmicpc.net/contest/view/897' } },
            { type: 'string', content: 'Served as an executive member of the Sogang University algorithm club, organizing study sessions and programming contests.' },
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
};
