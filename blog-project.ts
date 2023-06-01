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
    description: '직접 제작한 개인 블로그',
    image: '/witch.jpeg',
    url: [
      {
        title: 'URL',
        link:'https://witch.work/'
      },
      {
        title: 'Github',
        link:'https://github.com/witch-factory/witch-next-blog'
      },
    ],
    techStack: ['Next.js', 'React', 'TypeScript']
  },
  {
    title:'CS 마인드맵(제작중)',
    description:'컴퓨터 공학 지식 마인드 맵',
    image:'/project/mind-map.jpg',
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
    description:'북마크 저장 서비스, 우리들의 URL \'우유\'',
    image:'/project/uyu.jpeg',
    url:[
      {
        title:'Github',
        link:'https://github.com/project-uyu'
      }
    ],
    techStack:['React', 'TypeScript']
  },
  {
    title:'Code Editor by C',
    description:'C로 직접 깎은 코드 에디터',
    image:'/project/autocomplete.gif',
    url:[
      {
        title:'Github',
        link:'https://github.com/witch-factory/editor_project'
      },
    ],
    techStack:['C', 'ncurses']
  },
];

export default projectList;