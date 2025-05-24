import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blog of Kim Sung Hyun, a.k.a Witch',
    short_name: 'Witch-Work',
    description: '마녀라는 닉네임을 쓰는 프론트 개발자입니다. 제가 탐구하고 공부한 것들을 씁니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  };
}
