---
title: 데이터 추상화 레이어를 제공하는 velite를 알아보자
date: "2024-04-08T00:00:00Z"
description: "velite 라이브러리 소개"
tags: ["front"]
---

# 이 글은 아직 작성 중입니다.

# 시작

기존 블로그에서 `.md` 파일을 글로 변환하기 위해서 contentlayer라는 라이브러리를 사용하였다. [하지만 이는 더 이상 유지보수되지 않고 있다.](https://github.com/contentlayerdev/contentlayer/issues/429) 해당 링크의 이슈와 다른 이슈들을 보면 contentlayer의 원래 메인테이너는 Prisma에 관여하고 있고 Vercel에서 contentlayer에 대한 후원도 중단했기 때문에 유지보수가 쉽지 않을 듯 했다.

[2024년 4월 2일에 달린 다른 메인테이너의 댓글](https://github.com/contentlayerdev/contentlayer/issues/651#issuecomment-2030335434)을 보면 논의 중이라고는 하는데 사실 활발히 유지보수될 수 있을지 잘 모르겠다. 그래서 나는 내 블로그에서 contentlayer를 대체할 라이브러리를 찾아보기로 했다.

그중 velite라는 라이브러리를 찾았고 아직 베타 버전이기는 하지만 블로그에 사용하면서 나름 만족스러웠기에 이를 소개하고자 한다.

# 1. 소개

velite의 핵심은 JSON, 마크다운, yaml등의 데이터가 담긴 파일들을 읽어서 애플리케이션에서 다룰 수 있도록 하나의 추상화 계층을 만들어 주는 것이다.

이때 데이터 자체에 대한 정보를 담은 제목, 간단한 설명 등의 메타데이터도 함께 추출해주며 [zod](https://zod.dev/) 라이브러리의 스키마를 통해서 타입과 유효성 검사도 해준다.

# 2. 기본적인 사용

npm, yarn, pnpm 등으로 패키지를 설치했다는 가정하에 진행한다.

## 2.1. collection 정의

velite는 collection을 이용해서 데이터가 어떤 방식으로 표현될 것인지 정의할 수 있다. `defineCollection` 함수를 사용하여 collection을 정의한다.

데이터의 형태를 정의할 때는 zod의 `z`를 확장한 `s` 라는 객체를 사용하며 이는 `s.slug()`, `s.markdown()`등의 커스텀 스키마를 제공한다.

예를 들어 블로그 글이라면 다음과 같이 collection을 정의할 수 있다. 다음 collection은 실제 내 블로그에 정의된 collection을 약간 편집한 것이다. 파일의 경로, 글 제목, 글 작성 날짜, 글 태그들, 마크다운을 HTML 문서의 문자열로 변환한 것 등이 들어 있다.

name, pattern 속성도 확인할 수 있는데 name은 collection의 타입명이 되고 pattern은 해당 패턴을 갖는 경로 데이터를 이 collection으로 인식하여 변환하겠다는 의미를 가진다.

따라서 다음 collection을 velite로 변환 시 `content/posts/`(단 이후 설명할 설정 파일에서 컨텐츠 루트 디렉토리가 다른 경로로 설정되어 있을 경우 이 경로는 달라질 수 있다) 디렉토리에 있는 모든 `.md` 파일이 이 collection에 따라 변환되고 해당 파일의 데이터 타입은 `Post` 라는 이름을 갖게 된다.

```ts
// velite.config.ts
import { defineCollection, s } from 'velite'

const blogPost=defineCollection({
  name:'Post',
  pattern:'posts/**/*.md',
  schema:s.object({
    slug: s.path(),
    title: s.string().max(99),
    date: s.string().datetime(),
    tags: s.array(s.string()),
    html:s.markdown({
      gfm:true,
    }),
    thumbnail:s.image(),
  })
})
```

참고로 `defineCollection`과 거기 쓰인 `Collection` 타입은 다음과 같이 정의되어 있다.

위에서 쓰이지 않은 `single` 속성은 해당 collection이 단일 데이터만을 가지는지 여부를 나타낸다. 이 속성이 true이면 해당 collection은 단일 요소만을 가지게 된다. 사이트 메타데이터와 같이 단 하나의 요소만을 가지는 경우에 사용할 수 있지만 일반적인 경우는 아니므로 기본값은 false이고 생략해도 된다.

```ts
declare const defineCollection: <T extends Collection>(collection: T) => T;

interface Collection {
  name: string;
  pattern: string;
  single?: boolean;
  schema: ZodType;
}
```

## 2.2. 설정 정의

[velite Configuration 문서](https://velite.js.org/reference/config)

이후 velite에서 데이터를 애플리케이션에서 사용할 수 있는 형태로 변환하게 되는데 그때 velite는 프로젝트 루트의 `velite.config.ts` 파일을 읽어서 설정을 참조한다. 이 설정은 `defineConfig` 함수로 정의할 수 있다. 해당 함수로 정의한 설정 객체를 `export default`로 내보내면 velite에서 알아서 해당 설정을 통해 데이터를 변환해 준다.

```ts
// velite.config.ts
import { defineConfig } from 'velite'

export default defineConfig({
  root: 'content', // 컨텐츠 데이터가 있는 디렉토리
  output:{
    // 변환된 데이터의 저장에 대한 설정
    data:'.velite',
    assets:'public/static',
    base:'/static/',
    name:'[name]-[hash:8].[ext]',
    clean:true
  },
  // 변환할 collection들
  collections:[
    blogPost
  ],
  // md, mdx의 변환에 사용될 remark, rehype 플러그인 설정
  markdown:{
    remarkPlugins:[],
    rehypePlugins:[]
  },
  mdx:{
    remarkPlugins:[],
    rehypePlugins:[]
  },
  prepare:({blogPost})=>{
    // blogPost에 대한 추가적인 처리
    // 변환 데이터가 파일에 쓰이기 전에 처리된다
    // 변환 데이터에 대한 수정, 추가적인 데이터 생성 등이 가능하다
    // prepare, complete 메서드는 #4 에서 다룬다.
  },
  complete:({blogPost})=>{
    // 데이터 변환과 파일 생성이 끝난 후 처리된다
    // CDN에 이미지 업로드, 결과 파일 배포 등의 추가적인 작업
  }
})
```

`defineConfig` 함수 타입과 여기 쓰인 `UserConfig` 타입은 다음과 같이 정의되어 있다.

```ts
declare const defineConfig: <T extends Collections>(config: UserConfig<T>) => UserConfig<T>;

interface UserConfig<T extends Collections = Collections> extends Partial<PluginConfig> {
    root?: string;
    output?: Partial<Output>;
    collections: T;
    loaders?: Loader[];
    markdown?: MarkdownOptions;
    mdx?: MdxOptions;
    prepare?: (data: Result<T>) => Promisable<void | false>;
    complete?: (data: Result<T>) => Promisable<void>;
}
```

`defineConfig` 대신 `UserConfig` 타입을 이용해서 설정 객체를 정의하고 export default를 해도 된다.

```ts
// velite.config.ts
import { UserConfig } from 'velite'

const config:UserConfig={
  // ...
}

export default config;
```

하지만 공식 문서에 의하면 `defineConfig`를 사용하는 편이 더 나은 타입 추론을 제공하기 때문에 `defineConfig`를 사용하는 것이 낫다고 한다.


## 2.3. 데이터 변환과 사용

프로젝트 루트의 `velite.config.ts`에 collection을 정의하고 이를 이용해서 설정 객체까지 정의했다면 이제 velite를 실행하여 데이터를 변환할 수 있다. 프로젝트 경로의 터미널에서 다음 명령어를 실행할 경우 설정 파일에서 설정한 root 경로(기본값은 `content`)에 있는 데이터를 변환하여 설정 파일에서 설정한 output 경로에 저장한다.

```bash
# 프로젝트에서 사용하는 패키지 매니저에 따라 npx, yarn 등을 사용해도 잘 동작한다
pnpm velite
```

변환된 데이터는 설정 파일의 설정 객체에서 정의한 `output.data` 경로에 저장된다. 이 기본값은 프로젝트 루트의 `.velite`이다. 편리한 사용을 위해 경로의 alias를 설정해 주자. `tsconfig.json`에서 설정할 수 있다. 공식 문서에서는 `#site/content`를 alias로 쓰는 걸 권장하고 있다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#site/content": ["./.velite"]
    }
  }
}
```

다음과 같이 변환된 데이터를 가져와서 사용할 수 있다. 위에서 변환한 `blogPost` collection이라면 다음과 같이 사용할 수 있다. 이렇게 불러온 `blogPost`는 collection에서 정의한 대로 `Post`의 배열 타입을 가진다.

```ts
// blogPost는 Post[] 타입
// 이 blogPost를 이용해서 블로그 글 데이터를 렌더링하거나 다룰 수 있다
import {blogPost} from '#site/content'
```

Next.js에 velite 플러그인을 추가해서 사용하는 방법에 대해서는 공식 [Integration with Next.js](https://velite.js.org/guide/with-nextjs) 문서를 참고할 수 있다. Next.js와 velite를 함께 사용하기 위해서는 필수적이다.

# 3. transform을 이용한 속성 정의

velite 설정 파일에서 `defineCollection`으로 데이터를 어떤 형식으로 변환할지 정의하였다. `defineConfig`로는 데이터 변환 그 자체에 대한 설정을 정의했다. 어떤 폴더에서 데이터를 가져오고 어떤 폴더에 변환 결과를 넣을지, 마크다운 변환시 플러그인은 뭘 쓸지 등을 정의할 수 있었다. 그렇게 정의된 형식과 설정에 따라 velite는 데이터를 변환해 주었고 우리는 그것을 `.velite`에서 가져다 쓰는 것이다.

이렇게 형식을 정의해서 데이터를 변환할 수 있는 것만 해도 충분히 유용하지만 velite에서는 스키마에 맞게 생성된 데이터를 이용해서 추가 속성이나 커스텀 속성을 정의할 수 있다.

## 3.1. 변환된 데이터를 이용한 추가 속성 정의

velite에서 데이터 스키마를 위해 지원하는 `s` 객체는 zod의 모든 기능을 지원한다. 또한 이후 보겠지만 velite의 데이터 변환은 zod의 `.safeParseAsync`를 이용한다. 따라서 zod의 문자열 변환을 위한 `toLowerCase()`등의 트랜스포머 메서드를 사용할 수 있다.

사용자 정의 트랜스포머 메서드를 정의할 수 있게 해주는 `.transform()`도 당연히 지원한다. 이 메서드를 이용해서 기존에 정의한 데이터 스키마의 값들을 통해 새로운 값이나 커스텀 값을 만들어낼 수 있다.

`defineCollection()`에 붙는 `transform` 메서드는 첫번째 인수로 `data`를 받으며 이는 collection에 맞게 변환된 데이터를 의미한다. 이 콜백에서 새로운 데이터를 반환하면 이 데이터가 새로운 변환 결과 데이터로 사용된다. 예를 들어 앞서 만들었던 `blogPost` collection에 `url` 속성을 추가하고 싶다면 다음과 같이 `slug` 속성을 이용해 만들 수 있다.

```ts
const blogPost=defineCollection({
  name:'Post',
  pattern:'posts/**/*.md',
  schema:s.object({
    slug: s.path(),
    title: s.string().max(99),
    date: s.string().datetime(),
    tags: s.array(s.string()),
    html:s.markdown({
      gfm:true,
    }),
    thumbnail:s.image(),
  })
  .transform((data)=>({
    ...data,
    url:`/posts/${data.slug}`
  }))
})
```

`url`이 타입으로 검증되어야 한다면 collection의 schema에 optional로 추가해주면 된다. 다음과 같이 말이다.

```ts
const blogPost=defineCollection({
  name:'Post',
  pattern:'posts/**/*.md',
  schema:s.object({
    // ...
    url:s.string().optional()
  })
  .transform((data)=>({
    ...data,
    url:`/posts/${data.slug}`
  }))
})
```

원래 zod에서는 `transform` 메서드를 이용해서 새로운 속성을 추가해도 타입 검증이 이루어지도록 할 수 있지만 아직 지원되지 않는 듯 했다.

## 3.2. 메타데이터를 이용한 추가 속성 정의

`transform` 메서드가 인자로 받는 콜백 함수는 데이터의 변환 결과 외에도 `meta` 속성을 갖는 객체를 2번째 인자로 받는다. 이 속성은 변환된 데이터에 관한 메타데이터를 갖는다. 변환된 데이터의 단순 텍스트 형태인 `meta.plain` 등이 있다.

타입을 보면 앞서 다룬 `transform` 메서드는 `ZodType` 클래스에 정의되어 있다. 이 메서드의 콜백 함수 인자의 타입을 따라가면 2번째 인자 객체의 `meta` 속성은 `VeliteMeta`를 확장한 `ZodMeta` 타입을 갖는다. 즉 `meta`는 다음과 같은 형태를 갖는다고 할 수 있다.

```ts
interface ZodMeta extends VeliteMeta {}

export class VeliteMeta extends VFile {
  config: Config
  private _mdast: Root | undefined
  private _hast: Nodes | undefined
  private _plain: string | undefined

  constructor({ path, config }: { path: string; config: Config }) { ... } 
  get records(): unknown { ... }
  get content(): string | undefined { ... }
  get mdast(): Root | undefined { ... }
  get hast(): Nodes | undefined { ... }
  get plain(): string | undefined { ... }
  static async create({ path, config }: { path: string; config: Config }): Promise<VeliteMeta> {
    // ...
  }
}
```

이를 잘 조작해서 추가 데이터를 만들어낼 수 있다.

### 3.2.1. 커스텀 스키마 만들기

예를 들어서 페이지 메타데이터 등에 사용하기 위해서 글의 시작 부분에서 특정 길이만큼의 문자열을 추출하고 싶다고 하자. `VeliteMeta` 클래스에서는 `meta.plain` 속성을 통해서 데이터의 텍스트 본문만 뽑아 가져올 수 있다. 이 `plain` 문자열에서 특정 길이만큼 추출해서 `excerpt` 속성을 만들어내는 커스텀 스키마를 만들면 된다. 여기서는 100자 이내로 추출하도록 했다.

```ts
const posts = defineCollection({
  schema: s.object({
    // ...
    excerpt: s.custom().transform((data, {meta})=>{
      const { plain } = meta;
      return plain.slice(0, 100);
    })
  })
})
```

이는 이미 velite에서 `s.excerpt({length: number})`라는 zod의 확장 스키마를 통해 지원하고 있다. `meta`의 속성을 이용하는 가장 단순한 예시 중 하나라서 약간 변경해 가져온 것이다.

좀 더 유용한 예시는 `meta.mdast`를 이용해서 마크다운 AST를 순회하며 특정 속성을 만드는 것이다. 이 `mdast` 메타데이터는 공식 문서에 나와 있지는 않지만 [velite의 meta.ts 코드](https://github.com/zce/velite/blob/main/src/meta.ts)와 앞서 보았던 타입을 보면 알 수 있다.

`mdast`를 순회하면서 Heading 태그들을 이용하여 toc에 쓰일 트리를 만드는 작업을 직접 하는 것이다. velite에서는 `s.toc()`를 지원하지만 중복 처리와 HTML 요소에 `id` 속성을 추가하는 등의 부분에서 커스텀이 어려운 부분이 있어 원하는 toc 로직이 있을 경우 이렇게 직접 만들어 사용하는 것도 장점이 있다.

```ts
const posts = defineCollection({
  // ...
  schema: s
    .object({
      // ...
      headingTree:s.custom().transform((data, { meta }) => {
        if (!meta.mdast) return [];
        return generateHeadingTree(meta.mdast);
      }),
    })
})

// generateHeadingTree는 다른 파일에 이런 식으로 정의되어 있다
export function generateHeadingTree(tree: Mdast) {
  const headingID: Record<string, number> = {};
  const output: TocEntry[] = [];
  const depthMap = {};
  visit(tree, 'heading', (node: Heading) => {
    processHeadingNode(node, output, depthMap, headingID);
  });
  return output;
}
```

### 3.2.2. 추가 속성 만들기

`.transform()` 메서드는 앞서 언급한 커스텀 스키마를 만들 때도 사용할 수 있다. 애초에 스키마를 이용해서 데이터를 파싱할 때 결과에 대한 어떤 변환을 만드는 메서드이기 때문이다.

그런데 이를 변환이 완료된 데이터에 추가적인 변환을 수행할 때도 사용할 수 있다. 앞서 `#3.1`에서 다룬 것과 같다. 특히 변환된 데이터의 결과물(`transform` 메서드에 인자로 넘어가는 콜백의 `data`)과 `meta`의 속성을 둘 다 이용해서 추가적인 속성을 만들 때 유용하다.

이 블로그 같은 경우 각 글에 해당하는 대표 이미지가 있고 그것이 글 목록의 썸네일이자 open graph 이미지로 들어가게 된다. 따라서 이를 위한 `thumbnail` 속성을 만들어내는 작업을 `transform` 메서드를 이용해서 할 수 있다.

다음 코드는 내 블로그에서 실제로 썸네일을 생성하고 있는 코드를 약간 편집해서 가져온 것이다. `meta.mdast`와 변환 데이터의 제목, 목차, slug 등을 이용해서 대표 이미지를 생성한다. 글의 이미지가 있으면 그것을 대표 이미지로 사용하고 없으면 글의 제목, 목차, slug 등을 `canvas`로 이미지로 만든 후 이를 대표 이미지로 사용한다.

```ts
// velite.config.ts
const posts = defineCollection({
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      // ...
      thumbnail:s.object({
        local:s.string(),
      }).optional(),
    })
    .transform(async (data, { meta }) => {
      const thumbnail: ThumbnailType = {
        local: await generateThumbnailURL(meta.mdast, data.title, data.headingTree, data.slug);
      };
      return ({ ...data, url: `/posts/${data.slug}`, thumbnail });
    })
});

// mdast를 순회하면서 모든 이미지 뽑아내기
function extractImgSrc(mdast: Mdast) {
  const images: string[] = [];
  visit(mdast, 'image', (node)=>{
    images.push(node.url);
  });
  return images;
}

export async function generateThumbnailURL(meta: VeliteMeta, title: string, headingTree: TocEntry[], filePath: string) {
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    // 글의 첫 번째 이미지를 대표 이미지로 사용
    const imageURL = images[0];
    return isRelativePath(imageURL) ?
      processImageForThumbnail(imageURL, meta.mdast, filePath) :
      imageURL;
  }
  else {
    // 썸네일 직접 생성
    return createThumbnail(title, headingTree, filePath);
  }
}
```

# 4. 데이터 변환 후 추가 작업

velite는 데이터 변환 후 JSON 파일에 변환 결과를 쓰기 전에 추가 작업을 할 수 있는 `prepare` 메서드와 변환 후 파일을 생성한 후 추가 작업을 할 수 있는 `complete` 메서드를 설정 객체에서 제공한다. `defineConfig` 함수의 인자로 들어가는 객체 속성으로 사용할 수 있다.

## 4.1. prepare

설정 객체의 `prepare` 메서드는 말 그대로 데이터가 파일에 쓰이기 전에 준비할 게 있으면 처리하는 데 쓴다. 예를 들어 데이터를 수정하거나 필터링하거나 뭔가 빠진 속성을 추가하는 등의 작업을 할 수 있다. 변환된 데이터를 속성으로 갖는 객체를 인자로 받는다. 예를 들어 앞에서는 `blogPost` collection을 이용해서 데이터를 변환했는데 이 변환된 데이터가 바로 `prepare` 메서드의 인자로 들어간다. `prepare` 에서 리턴한 데이터가 실제 변환 데이터로 사용된다.

대표적인 예시로 어떤 문서가 아직 작성중인지를 뜻하는 `draft` 속성을 가지고 있다면 실제 변환되는 데이터에는 포함되지 않도록 하는 작업이 대표적으로 `prepare`에서 할 수 있는 작업이다. 이는 공식 문서의 예시 코드에서도 사용한 방식이다.

```ts
const posts = defineCollection({
  schema: s
    .object({
      // ...
      draft: s.boolean().optional(),
    }),
  collections: { blogPost },
  prepare: ({ blogPost }) => {
    // draft가 true인 문서는 제외하고 변환 데이터를 작성하도록 한다
    blogPost = blogPost.filter((post) => !post.draft);
  }
});
```

또는 글에 태그 속성이 있다면 전체 태그를 뽑아내는 등의 작업도 가능하다.

## 4.2. complete

설정 객체의 `complete` 메서드는 변환이 모두 끝나고 데이터가 파일에 작성되는 작업까지 끝난 후에 추가 작업을 할 때 사용한다. 예를 들어 변환된 데이터를 CDN에 업로드하거나 결과 파일을 배포하는 등의 작업을 할 수 있다. `prepare`와 같이 변환된 데이터를 속성으로 갖는 객체를 인자로 받는다.

단 해당 시점에는 이미 데이터 변환과 변환 결과 파일 작성이 끝난 시점이므로 `fs.writeFile`과 같은 함수를 통해 파일을 직접 조작하지 않는 이상 변환된 데이터를 수정하는 작업을 자연스럽게 할 수는 없다. 대신 변환된 데이터를 OSS에 업로드하거나 이미지를 CDN에 업로드하는 등의 작업을 할 수 있다.

```ts
const posts = defineCollection({
  schema: s
    .object({
      // ...
      thumbnail: s.object({
        // 로컬 경로의 썸네일 URL
        local: s.string(),
      }).optional(),
    }),
  collections: { blogPost },
  complete: async ({ blogPost }) => {
    // 변환된 데이터에서 썸네일 이미지를 CDN에 업로드
    await Promise.all(
      blogPost.map(async (post) => {
        if (post.thumbnail) {
          await uploadThumbnailToCDN(post.thumbnail.local);
        }
      })
    );
  }
});
```

# 5. vs contentlayer

velite와 contentlayer는 둘 모두 마크다운, mdx, yaml 등의 데이터를 다루기 위한 추상화 계층과 타입을 제공한다. 프레임워크에 대한 의존성이 없어서 Next.js건 Vue건 프레임워크에 상관없이 사용할 수 있다는 점도 비슷하다. 하지만 둘 간의 장단점과 차이가 분명 있기 때문에 이를 비교해보고자 한다.

## 5.1. 데이터 변환

velite는 이미지와 정적 파일을 자동으로 `/public`으로 경로 변경을 해주는 등 contentlayer에 비해 데이터 변환에 있어서 기본적으로 더 많은 기능을 제공한다. contentlayer는 이미지 경로 변경을 지원하지 않았다. 또한 velite는 zod를 이용한 타입 검증을 지원하고 있다.

contentlayer는 데이터 변환 중간에 `file`을 한번 거치기 때문에 파일을 변환하는 과정을 커스텀하기 상대적으로 쉬웠다. 하지만 velite는 zod의 스키마와 `safeParseAsync`를 이용해서 데이터를 변환하기 때문에 이 과정을 커스텀하기 어렵다.

## 5.2. 작성중

# 6. 다른 대안들

## 6.1. @next/mdx

[Next.js 공식 문서에서도 마크다운을 변환하는 방법을 소개하고 있었다.](https://nextjs.org/docs/app/building-your-application/configuring/mdx) `@next/mdx`라는 라이브러리를 사용하는 방식이다. Next.js의 공식 문서에도 소개되어 있고 Vercel의 레포지토리에 속해 있는 만큼 contentlayer와 같이 갑자기 유지보수가 중단되지 않을 것이다.

하지만 당연히 단점도 있다.

먼저 contentlayer에서는 프로젝트 루트의 `/posts` 경로에서 글을 관리했었는데 `@next/mdx`를 사용할 경우 모든 글을 Next.js의 `app/` 디렉토리에 넣어야 한다. 이 점은 next-mdx-remote 라이브러리를 사용하여 해결할 수 있기는 하다. 하지만 rsc 지원이 아직 불안정하고 또한 next-mdx-remote는 원격으로 데이터를 가져오기 위한 라이브러리인데 이를 다른 로컬 경로에 있는 파일을 가져오기 위한 라이브러리로 사용하는 것은 좋지 않다.

또한 이 라이브러리를 사용하는 경우 문서를 원하는 대로 커스터마이징하기 어렵다. contentlayer는 아예 `.md` 파일 내용을 HTML 형식의 문자열로 만들어 주고 이를 사용자가 가져다가 커스터마이징할 수 있었다. 하지만 `@next/mdx`는 `.md`나 `.mdx` 파일을 하나의 페이지로 만드는 형식이기 때문에 커스텀이 상대적으로 어렵다.

각 컴포넌트의 스타일링도 CSS를 통해서 쉽게 할 수 있었던 contentlayer와 달리 `mdx-components.tsx` 파일을 만들어서 커스텀 컴포넌트를 만들어야 한다.

기존 코드와의 호환성과 유지보수를 위해 다른 대안을 찾아보기로 했다.

## 6.2. marked

[블로그 개편기 - 4. marked를 활용한 마크다운 변환기 구현하기](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4)에서 사용하고 있는 marked 라이브러리도 방법이었다.

하지만 이 역시 기존 코드나 기존 글 형식과 호환이 힘들었고 또한 커스텀 컴포넌트를 만들어야 한다. 잘 사용하고 있던 remark와 rehype 플러그인도 버려야 한다. 나는 사용하지 않았지만 해당 블로그의 결과물은 나쁘지 않아 보인다. 커스터마이징에도 꽤나 자유도가 있는 듯 보였다.

# 참고

[velite 공식 문서](https://velite.js.org/)

[NextJS 14 Markdown Blog: TypeScript, Tailwind, shadcn/ui, MDX, Velite 영상](https://www.youtube.com/watch?v=tSI98g3PDyE)

[Zod로 입출력 간 데이터 변환하기](https://www.daleseo.com/zod-transformation/)