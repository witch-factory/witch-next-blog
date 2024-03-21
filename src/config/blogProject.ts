import { BlogProjectType } from '@/types/config';


export const blogProjectList: BlogProjectType[] = [
  {
    title: 'Witch-Work',
    description: '직접 제작한 개인 블로그',
    image:{
      local:'/witch-new-hat.png',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/v1696778610/blog/witch-new-hat-cut_btqftx.png',
      blurURL:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAACXBIWXMAAAsSAAALEgHS3X78AAAAoklEQVR4nCWKPwsBARyGf5/klMFkQvcBFINBFgblFiZyg81wSTJYREZZbvEJ0A1sl1nJ7Lqzuk10fx450/M+b48AxHH8A9OliVpssLdOiUdRjARBkIh1tBGljEiGar3N0/eTX4IwTEbHWCDZGlKosNkd+Lze/8DzHoxnKySdR1I5RMkjagnbPuO6HnK53jAmc7r6EE3r02z10Acj1uaWu+PwBVA+c4D4Dk4qAAAAAElFTkSuQmCC'
    },
    url: 'https://witch.work/',
    tags: ['Next.js', 'React', 'TypeScript']
  },
  {
    title:'CookieDog 블로그',
    description:'음악 NFT 서비스 쿠키독 블로그',
    image:{
      local:'/project/cookiedog.jpeg',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/v1689251955/blog/cookiedog_g9vxda.jpg',
      blurURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAIAAAD38zoCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAfElEQVR4nB3MvQnFIBhG4W8jIY2FAzhBKotsIbYpncFJnCDgCoKFaK0gAQvxvT+nfeAQgJSS977WCmCthX/UWjvPkzF2HIdSyhgjpey905xzjOGcE0IQEedca733JgDv+973rZS6rstau/f+rQCUUp7nyTmnlEIIMcYvfABpWlT3QHs/HQAAAABJRU5ErkJggg=='
    },
    url:'https://cookiedog-blog.vercel.app/',
    tags:['React', 'Firebase', 'styled-components']
  },
  {
    title:'UYU(제작중)',
    description:'북마크 저장 서비스, 우리들의 URL \'우유\'',
    image:{
      local:'/project/uyu.jpeg',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565873/blog/uyu_yq5iyz.jpg',
      blurURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAIAAAD38zoCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAc0lEQVR4nGM4vaYFhFY3n1jRcBbMgIgwnF7TcmJFw5VtU/7/fnXj8PoTq9ogciCJ48sbbu2cvHXd8pa68gPzK86saQNJnFzReHHzxM1dod4sDBYMDFMK3a9um3ByRSNIx+k1LSdXNG7ri1rWGLR3fiXEDgAFr0qUiEmqcwAAAABJRU5ErkJggg=='
    },
    url:'https://github.com/project-uyu',
    tags:['React', 'TypeScript']
  },
  {
    title:'Code Editor by C',
    description:'C로 직접 깎은 코드 에디터',
    image:{
      local:'/project/autocomplete.gif',
      cloudinary:'https://res.cloudinary.com/desigzbvj/image/upload/c_scale,w_400,f_auto/v1686565872/blog/autocomplete_p45wk7.gif',
      blurURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAApUlEQVR4nGPomrrw/5RZc/5///79f0xSzH9DI6P/4hIS/zk4Of9zc3P/Z5CXkv7Py8TyX5CT6z8nA9N/XRXV/4ogMR5uiIL0hMz/SydO+790ypT/kX4+/42V1f+ryin8l5aS+i8sLPyfoa5lwv+ZM+f/37ppy//25qb/Rtp6/1WUVf6rq6r/FxUR+c9gaW77//rlO/+Lykr/MzAwgDE7BzsYg6wAAGpoRtFgpmv1AAAAAElFTkSuQmCC'
    },
    url:'https://github.com/witch-factory/editor_project',
    tags:['C', 'ncurses']
  },
];
