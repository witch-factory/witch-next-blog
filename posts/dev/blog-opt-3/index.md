---
title: 블로그 최적화 - 3. 이미지 최적화
date: "2023-06-11T03:00:00Z"
description: "겁나 빠른 마녀 : 블로그 최적화 그 세번째"
tags: ["blog", "web"]
---

# 1. 이미지 최적화

이미지를 전반적으로 최적화하는 글이다.
일단 글 목록 페이지에 대한 lighthouse의 제안과 진단을 볼까? 음...점수는 처참하지만 천릿길도 한 걸음부터니까, 할 수 있는 걸 하자.

![category-page-diagnostics](./category-page-diagnostics.png)

아까처럼 이미지에 적당한 크기를 주라고 한다. Card 컴포넌트에서 Image 태그에 sizes를 지정하자.

```jsx
function Card(props: Props) {
/* 생략 */
  <Image 
    className={styles.image} 
    src={image} 
    alt={`${image} 사진`} 
    width={200} 
    height={200}
    sizes='100px'
  />
/* 생략 */
}
```

그리고 이미지의 `minimumCacheTTL` 도 하루로 설정한다. `next.config.js`에서 설정할 수 있다.

```js
const nextConfig = {
  images:{
    unoptimized:false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60*60*24*30,
  },
  reactStrictMode: false,
  swcMinify:true,
};
```

# 2. Cloudinary 사용해보기

마침 매우 도움이 되는 글을 찾았다. [매우 많은 이미지를 서빙하는 갤러리를 NextJS로 만드는 글](https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js)이 Vercel에서 공식으로 올라와 있었다!

이 블로그에서는 cloudinary를 이용해서 이미지를 서빙했다고 한다. 한번 이걸 써보자.

먼저 [cloudinary](https://cloudinary.com/)에 가입하자. 나는 구글로 가입했다. 그러면 마이페이지에 다음과 같은 화면이 나온다.

![after-login](./cloudinary-after-login.png)

여기의 좌측 메뉴에서 Media Library로 들어가면 Asset을 올릴 수 있다. 구글 드라이브와 거의 똑같은 UI라서 드래그 앤 드롭으로 이미지 등을 올리면 된다.

예를 들어서 나는 samples 폴더에 내 프로필 사진을 올렸었는데 그러면 다음과 같은 URL을 얻을 수 있다. 사진에 마우스 커서를 올리면 URL을 복사할 수 있는 버튼이 있더라. [URL의 구조는 공식 문서를 참고했다.](https://cloudinary.com/documentation/transformation_reference)

```
https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>

https://res.cloudinary.com/내 cloud name/asset 타입(image등)/어떻게 전송되었는지/버전/폴더명/witch_xjp39k.jpg
```

이런 걸 API를 이용해서 불러오려면 먼저 `.env.local`에 API 키를 설정하자. 이 키들은 Setting의 Access Keys 메뉴에서 가져올 수 있다.

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=replace
CLOUDINARY_API_KEY=replace
CLOUDINARY_API_SECRET=replace
```

`next.config.js`에 다음과 같이 설정을 추가하여 `res.cloudinary.com`에서 이미지를 가져올 수 있게 허용한다.

```js
/* nextConfig만 편집 */
const nextConfig = {
  images:{
    unoptimized:false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    /* 도메인에 cloudinary 추가 */
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,
  swcMinify:true,
};
```

이제 이미지 URL을 이용해서 다음과 같이 이미지를 가져와볼 수 있다.

```jsx
<Image
  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1686541466/samples/witch_xjp39k.jpg`}
  alt='프로필 사진'
  width={300}
  height={300}
/>
```

이를 Vercel에서도 쓸 수 있게 위의 환경변수들을 Vercel에서도 추가한다. 현재 환경 변수들은 다음과 같은 것들이 있다.

![vercel 환경 변수들](./vercel-env-var.png)

# 3. 이미지 서빙 시스템 설계

기존에는 모든 이미지를 다 웹사이트 빌드 시에 같이 넣어 주었다. 그런데 이제는 cloudinary를 사용할 것이다. 하지만 그럼 기존에 쓰던 이미지 저장 방식은 아예 버려야 할까?

그럴 수도 있겠지만 이미지 저장 방식을 바꿀 때 새로운 방식밖에 쓸 수 없도록 바꾸는 게 좋지는 않다고 생각한다. cloudinary를 무제한으로 쓸 수 있는 것도 아니기에 언젠가 기존의 저장 방식으로 돌아와야 할 수도 있다. 그리고 또다른 클라우드 저장소를 사용하게 될 수도 있다.

이런 걱정을 하는 이유는 물론 돈이다. 나는 프리티어나 아주 저렴한 요금제밖에 쓸 수 없는데 cloudinary의 유료정책은 꽤 비싸니까...

![돈이 없어](./no-money.webp)

따라서 `blog-config.ts`의 `blogConfig`에 이미지를 어디에 저장할지도 택할 수 있게 하자. 기본값은 `local`이다. 

`blogConfig.imageStorage` 값이 `local`이면 `public/images`에 저장하고, `cloudinary`면 cloudinary에 저장하도록 하고 이미지 URL은 2가지로 저장하여 사용자가 설정하는 `blogConfig.imageStorage`에 따라서 불러오도록 하자.

```ts
interface BlogConfigType {
  name: string;
  title: string;
  description: string;
  picture: string;
  url: string;
  social: {
    Github: string;
    BOJ: string;
  };
  comment: {
      type: 'giscus';
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      lang?: 'ko' | 'en'; // defaults to 'en'
      lazy?: boolean;
    };
    /* 이미지 저장소를 선택할 수 있도록 타입 지정 */
  imageStorage: 'local' | 'cloudinary'; // defaults to 'local'
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
}
```

# 4. 메인 페이지 이미지 최적화

메인 페이지에 있는 이미지는 내 프로필의 것을 뺀다면 고작 4개뿐이다. 프로젝트들의 이미지들이다. 그리고 이는 동적으로 생성되는 게 아니기 때문에 바꾸기도 쉽다. Cloudinary에 업로드한 후 각 이미지를 쓰는 태그의 src를 바꿔주면 된다.

먼저 `blog-project.ts`에서 프로젝트의 저장 시 image URL 타입을 local, cloudinary 두 URL 모두가 담길 수 있도록 변경하자.

```ts
// blog-project.ts
export interface projectType {
  title: string;
  description: string;
  image: {
    local: string;
    cloudinary: string;
  };
  url: {
    title: string;
    link: string;
  }[];
  techStack: string[];
}
```

그리고 cloudinary media library에서 `/blog` 폴더를 생성한다.

![블로그 폴더 생성](./new-blog-folder.png)

이렇게 생성한 폴더에 프로젝트 사진들(`/public/project`에 있던 그 이미지들)을 업로드한다. 그러면 URL이 생기는데 이를 `projectList`의 프로젝트 이미지에 넣어주자.

그런데 이때 전체 URL을 넣어놓는 건 좀 찝찝해서 cloudinary Image의 경우 public ID만 넣어 놓기로 했다. 예를 들면 이렇게.

```ts
const projectList: projectType[] = [
  {
    title: 'Witch-Work',
    description: '직접 제작한 개인 블로그',
    image:{
      local:'/witch.jpeg',
      /* 이미지의 cloudinary public ID 추가 */
      cloudinary:'witch_t17vcr.jpg'
    },
    /* URL, techStack 속성 생략 */
  },
  /* 나머지 프로젝트 객체 생략 */
];
```

프로젝트를 보여주는 `ProjectCard` 컴포넌트에서는 `blogConfig.imageStorage`에 따라서 다른 이미지 URL을 사용하도록 하자.

```tsx
// src/components/projectCard/index.tsx
function ProjectCard({project}: {project: projectType}) {
  /* imageStorage 형식에 따라 URL 생성 */
  const imageURL=(blogConfig.imageStorage==='local'?'':`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400/blog/`)
  +project.image[blogConfig.imageStorage];

  return (
    <Link className={styles.wrapper} href={project.url[0].link} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <ProjectTitle title={project.title} />
        </div>
        <div className={styles.imagebox}>
          <ProjectImage title={project.title} image={imageURL} />
        </div>
        <div className={styles.introbox}>
          <ProjectIntro project={project} />
        </div>
      </article>
    </Link>
  );
}
```

# 참고

https://vercel.com/blog/building-a-fast-animated-image-gallery-with-next-js

https://nextjs.org/docs/pages/building-your-application/optimizing/images

https://cloudinary.com/documentation/image_upload_api_reference#upload

https://junheedot.tistory.com/entry/Next-Image-load-super-slow