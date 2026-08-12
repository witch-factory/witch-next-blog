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
  tagline: [
    'I would rather add joy to life than take away its inconveniences.',
    'I think about how to pave the path that draws people in.',
  ],
  contact: [
    {
      label: 'Blog',
      text: 'witch.work',
      url: 'https://witch.work',
    },
    {
      label: 'GitHub',
      text: 'witch-factory',
      url: 'https://github.com/witch-factory',
    },
    {
      label: 'Email',
      text: 'soakdma37@gmail.com',
      url: 'mailto:soakdma37@gmail.com',
    },
  ],
  summary:
    'I joined a side project as its second member (Founding Engineer) and helped grow it to 10K DAU and roughly 300M KRW in monthly revenue. I quickly grasp what a product is about and what its users need, then find and fix problems anywhere in it. I have documented my learning in around 200 blog posts.',
  career: [
    {
      title: 'AIOCIA Inc.',
      description: 'Elyn, an AI character chat service',
      tech: 'Next.js, React, TypeScript, Tailwind CSS, FastAPI',
      period: 'Jan 2026 - Jul 2026',
      role: 'Founding Engineer (Fullstack)',
      links: [
        {
          text: 'Live Service',
          url: 'https://elyn.ai/',
        },
      ],
      details: [
        {
          items: [
            { type: 'string', content: 'Joined a company that began as a toy project and helped grow it to 10K DAU and 300M KRW in monthly revenue, through to its acquisition.' },
          ],
        },
        {
          title: 'Product Features and Operations',
          items: [
            { type: 'string', content: 'Proposed and built "Create user settings quickly with AI": pinpointed the onboarding barrier by combining usage patterns, community feedback, and hands-on use of the service.' },
            { type: 'string', content: 'Fixed chat data synchronization issues: consolidated scattered chat fetching, streaming, and cache invalidation logic, and redesigned it so server data is the single source of truth.' },
            { type: 'string', content: 'Established update announcement and customer support processes and moved them in-service, replacing operations that had depended on external social media.' },
          ],
        },
        {
          title: 'Product Performance',
          items: [
            { type: 'string', content: 'Cut network traffic by more than 50% by removing duplicate API calls and reworking how data refreshes when streaming completes.' },
            { type: 'string', content: 'Raised the main page Lighthouse performance score from 35 to 70: replaced JS-measured container widths with a CSS-based layout, introduced loading skeletons, and applied font lazy loading.' },
            { type: 'string', content: 'Reduced messages re-rendered per streamed token from at least 20 to 1 by separating references so only the updating message re-renders.' },
            { type: 'string', content: 'Reduced network requests when jumping to an in-chat search result from up to 50 to 1 by replacing sequential page fetches with server-side bidirectional pagination.' },
          ],
        },
        {
          title: 'Development Environment',
          items: [
            { type: 'string', content: 'Unified a legacy stack mixing MobX, zustand, SWR, and TanStack Query onto zustand and TanStack Query, and removed dead code for a net reduction of about 40,000 lines of production code.' },
            { type: 'string', content: 'Defined and documented policies for server/client data boundaries, query key management, and streaming, establishing them as team conventions.' },
            { type: 'string', content: 'Resolved security issues with user-authored JSX components by proposing AI pre-review and iframe isolation, then handled the resulting media query limitations with CSS container queries.' },
          ],
        },
      ],
    },
    {
      title: 'Graphic Inc.',
      description: 'Graphic, a global webtoon service',
      tech: 'Next.js, React, TypeScript, styled-components, SvelteKit, Firebase',
      period: 'Jul 2025 - Jan 2026',
      role: 'Frontend Developer',
      links: [
        {
          text: 'Live Service',
          url: 'https://graphic.fan/',
        },
      ],
      details: [
        {
          items: [
            { type: 'string', content: 'Built i18n support and designed and implemented the full policy branching of the creator revenue settlement funnel per country, together with the product owner.' },
            { type: 'string', content: 'Modularized the complex pricing policy of the comic store check-in/check-out system into a structure resilient to change.' },
            { type: 'string', content: 'Worked with store staff to add features they actually needed on site: check-out recovery, memos, macros for handling inquiries, and automated inventory updates.' },
          ],
        },
      ],
    },
    {
      title: 'Tmax FinAI',
      description: 'Rider insurance pages for the Delivery Service Cooperative Association',
      tech: 'React, TypeScript, styled-components, React Hook Form, TanStack Query',
      period: 'Aug 2023 - Sep 2024',
      role: 'Frontend Engineer',
      details: [
        {
          items: [
            { type: 'string', content: 'Built and shared tools that automate repetitive team work such as insurance terminology review, cutting manual work time by more than 50%.' },
            { type: 'string', content: 'Built components such as a TimePicker designed for keyboard interaction, accessibility (a11y), and type safety, to meet design requirements.' },
          ],
        },
      ],
    },
  ],
  project: [
    {
      title: 'Personal Blog',
      description: 'A multilingual personal blog built with Next.js',
      tech: 'Next.js, TypeScript, vanilla-extract',
      period: 'May 2023 - Present',
      role: 'Blog Owner & Developer',
      links: [
        { text: 'Live Site', url: 'https://witch.work/' },
        { text: 'GitHub', url: 'https://github.com/witch-factory/witch-next-blog' },
      ],
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Built the blog from scratch with Next.js, generating a table of contents and automating image path rewriting through custom remark plugins.',
              note: { text: 'Articles', url: 'https://witch.work/en/posts/tag/blog' },
            },
            {
              type: 'note-link',
              content: 'Built an AI-based automatic translation system to support English, improving global accessibility.',
              note: { text: 'Article', url: 'https://witch.work/en/posts/blog-auto-translation' },
            },
            {
              type: 'note-link',
              content: 'Traced a deployment build failure to bundle size and cut the bundle by 70% by changing the design and writing third-party code.',
              note: { text: 'Article', url: 'https://witch.work/en/posts/blog-bundle-reduction' },
            },
          ],
        },
      ],
    },
    {
      title: 'Sinchon Univ. Programming Club Alliance',
      description: 'Revamped the homepage and admin panel used for managing an algorithm camp',
      tech: 'Next.js, TypeScript, Nest.js, Prisma, Google Cloud Platform',
      period: 'May 2024 - Dec 2024',
      role: 'Program Director',
      links: [
        { text: 'Website', url: 'https://icpc-sinchon.io' },
      ],
      details: [
        {
          items: [
            { type: 'string', content: 'Rewrote the API server handling lecture attendance and assignment submissions from Go to Nest.js and Prisma.' },
            { type: 'string', content: 'Built a Discord bot for online lecture attendance using discord.js and deployed it alongside the server.' },
          ],
        },
      ],
    },
  ],
  activity: [
    {
      title: 'Open Source Contributions',
      period: '2023 - Present',
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Wrote a Prisma syntax highlighting plugin, now listed as an official third-party grammar.',
              note: { text: 'highlight.js PR #4252', url: 'https://github.com/highlightjs/highlight.js/pull/4252' },
            },
            {
              type: 'note-link',
              content: 'Migrated the ESLint configuration of the Yorkie JS SDK monorepo to flat config.',
              note: { text: 'yorkie-js-sdk PR #1045', url: 'https://github.com/yorkie-team/yorkie-js-sdk/pull/1045' },
            },
            {
              type: 'note-link',
              content: 'Replaced lodash with es-toolkit, cutting the Yorkie JS SDK example bundle size by 98%.',
              note: { text: 'yorkie-js-sdk PR #1101', url: 'https://github.com/yorkie-team/yorkie-js-sdk/pull/1101' },
            },
            {
              type: 'note-link',
              content: 'Corrected a historical inaccuracy about `@@unscopables` in MDN documentation.',
              note: { text: 'mdn/content PR #34646', url: 'https://github.com/mdn/content/pull/34646' },
            },
            {
              type: 'note-link',
              content: 'Corrected a historical inaccuracy about `NaN` in MDN documentation.',
              note: { text: 'mdn/content PR #35496', url: 'https://github.com/mdn/content/pull/35496' },
            },
            {
              type: 'note-link',
              content: 'Fixed an incorrect comment in the JavaScriptCore engine source.',
              note: { text: 'WebKit PR #25696', url: 'https://github.com/WebKit/WebKit/pull/25696' },
            },
            {
              type: 'note-link',
              content: 'Translated and published a 120-page paper on the history of JavaScript.',
              note: { text: 'Published Site', url: 'https://js-history.vercel.app/' },
            },
          ],
        },
      ],
    },
    {
      title: 'Presentations',
      period: '2021 - Present',
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Geultto frontend meetup: "Starting Networking My Way".',
              note: { text: 'Slides', url: 'https://github.com/witch-factory/presentations/blob/master/%EA%B8%80%EB%98%90_%EB%82%98%EC%9D%98_%EB%B0%A9%EC%8B%9D%EC%9C%BC%EB%A1%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9_%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0.pdf' },
            },
            {
              type: 'note-link',
              content: 'BBConf: a brief history of computers, networks, and the web, clarifying common misconceptions.',
              note: { text: 'Slides', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-winter/%ea%b9%80%ec%84%b1%ed%98%84_%eb%b8%8c%eb%9d%bc%ec%9a%b0%ec%a0%80%ec%97%90%20google%ec%9d%84%20%ec%b9%98%eb%a9%b4%20%ec%83%9d%ea%b8%b0%eb%8a%94%20%ec%9d%bc%ea%b9%8c%ec%a7%80%20%ec%83%9d%ea%b8%b4%20%ec%9d%bc.pdf' },
            },
            {
              type: 'note-link',
              content: 'How to sustain blogging for the long term and write better articles.',
              note: { text: 'Slides', url: 'https://bbconfwebdav.vulcan.site/bbconf/2024-summer/%eb%a7%88%eb%85%80_%eb%b8%94%eb%a1%9c%ea%b7%b8%eb%a1%9c_%ec%a7%84%ec%a7%9c_%ea%b0%9c%eb%b0%9c%ec%9e%90%ec%b2%98%eb%9f%bc_%eb%b3%b4%ec%9d%b4%eb%8a%94_%eb%b2%95.pdf' },
            },
            {
              type: 'note-link',
              content: 'Taught a winter break algorithm course to about 100 university students in the Sinchon area.',
              note: { text: 'Lecture Materials', url: 'https://github.com/witch-factory/presentations' },
            },
          ],
        },
      ],
    },
    {
      title: 'Developer Writing Group, Geultto 9th-10th Cohort',
      description: 'Selected for 10 articles in a curation program with an acceptance rate below 5%',
      period: '2023 - 2025',
      links: [
        { text: 'Website', url: 'https://geultto.github.io/' },
      ],
      details: [
        {
          items: [
            {
              type: 'note-link',
              content: 'Article on special comment formats in JavaScript, selected by Naver FE News (Feb 2024).',
              note: { text: 'Curation', url: 'https://github.com/naver/fe-news/blob/master/issues/2024-02.md#js%EC%9D%98-%EC%A3%BC%EC%84%9D%EC%9D%80-%EA%B3%BC--%EB%BF%90%EB%A7%8C%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4' },
            },
            {
              type: 'note-link',
              content: 'Deep dive tracing the history of closures from Turing machines to JavaScript, selected in Geultto 10th cohort.',
              note: { text: 'Article', url: 'https://witch.work/en/posts/javascript-closure-deep-dive-history' },
            },
            {
              type: 'note-link',
              content: 'Explained type system variance through TypeScript, selected in Geultto 9th cohort.',
              note: { text: 'Article', url: 'https://witch.work/en/posts/typescript-covariance-theory' },
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
        { type: 'string', content: 'Developed "Bandwagon", a platform for amateur bands, using React, zustand, and Tailwind CSS' },
      ],
    },
  ],
};
