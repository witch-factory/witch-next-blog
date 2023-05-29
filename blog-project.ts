export interface projectType {
  title: string;
  description: string;
  image: string;
  url: {
    title: string;
    link: string;
  }[];
  techStack: string[];
}

const projectList: projectType[] = [
  {
    title: 'Witch-Work',
    description: '직접 제작하고 Cloudflare로 배포해 운영중인 개인 블로그',
    image: '/witch.jpeg',
    url: [
      {
        title: 'Github',
        link:'https://github.com/witch-factory/witch-next-blog'
      },
      {
        title: 'URL',
        link:'https://witch.work/'
      }
    ],
    techStack: ['Next.js', 'React', 'TypeScript']
  },
  {
    title:'CS-Mindmap(제작중)',
    description:'컴퓨터 공학 지식을 공부하며 만든 마인드 맵',
    image:'/project/mindmap.svg',
    url:[
      {
        title:'URL',
        link:'https://cs.witch.work/'
      },
    ],
    techStack:['Next.js', 'TypeScript', 'Three.js']
  },
  {
    title:'UYU(제작중)',
    description:'쉬운 편집/보기가 가능한 북마크 저장 서비스, 우리들의 URL, 우유',
    image:'/project/uyu.jpeg',
    url:[
      {
        title:'Github',
        link:'https://github.com/project-uyu'
      }
    ],
    techStack:['React', 'TypeScript']
  },
];

export default projectList;