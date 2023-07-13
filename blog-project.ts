export interface projectType {
  title: string;
  description: string;
  image: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  };
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
    image:{
      local:'/witch.jpeg',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565864/blog/witch_t17vcr.jpg',
      blurURL:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAMABADAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYI/8QAIhAAAQQBBAIDAAAAAAAAAAAAAQIDBBESAAUhMQYTIjJx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGBEBAAMBAAAAAAAAAAAAAAAAAAECESH/2gAMAwEAAhEDEQA/ANsx/F1OTpr8x+UEOO5NpY3GUOO+R7MQOT8QK6/AFLoBtpYlOIccc3OWsJkunFSW6x9iqR9LoAgd3QHN2Tu+bxIM6wr/2Q=='
    },
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
    title:'CookieDog 블로그',
    description:'음악 NFT 서비스 쿠키독 블로그',
    image:{
      local:'/project/cookiedog.jpeg',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/v1689251955/blog/cookiedog_g9vxda.jpg'
    },
    url:[
      {
        title:'URL',
        link:'https://cookiedog-blog.vercel.app/'
      },
    ],
    techStack:['React', 'Firebase', 'styled-components']
  },
  {
    title:'UYU(제작중)',
    description:'북마크 저장 서비스, 우리들의 URL \'우유\'',
    image:{
      local:'/project/uyu.jpeg',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565873/blog/uyu_yq5iyz.jpg'
    },
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
    image:{
      local:'/project/autocomplete.gif',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565872/blog/autocomplete_p45wk7.gif'
    },
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

