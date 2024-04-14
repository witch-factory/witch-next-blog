---
title: 정적 컨텐츠를 쉽게 다룰 수 있게 해주는 velite를 알아보자
date: "2024-04-13T00:00:00Z"
description: "컨텐츠 추상화 레이어를 제공하며 contentlayer를 대체 가능한 velite"
tags: ["blog", "front", "react"]
---

![썸네일](./velite-thumbnail.png)

# velite의 발견

내 블로그에서는 마크다운으로 쓰인 글을 다루기 위해서 contentlayer라는 라이브러리를 사용하였다. [하지만 contentlayer는 더 이상 유지보수되지 않고 있다.](https://github.com/contentlayerdev/contentlayer/issues/429) 해당 링크의 이슈와 다른 이슈들을 보면 contentlayer의 원래 메인테이너는 Prisma에 관여하고 있다. 또한 Vercel에서 contentlayer에 대한 후원도 중단했다고 한다. 그렇게 돈도 없고 사람도 없어서 앞으로의 유지보수가 쉽지 않을 듯 보였다.

[2024년 4월 2일에 달린 다른 메인테이너의 댓글](https://github.com/contentlayerdev/contentlayer/issues/651#issuecomment-2030335434)을 보면 앞으로의 방향을 논의 중이라고는 한다. 그러나 메인테이너들이 다들 바쁜 사람들인 듯 했고 contentlayer보다 더 이용자가 많은 오픈소스에 여러 기여 중이었다. 그래서 contentlayer가 앞으로 활발히 유지보수될 수 있을지에 대한 확신을 주지는 못했다.

이런 이유로 블로그에서 contentlayer의 역할을 대체할 라이브러리를 찾아보기로 했다. 다음과 같은 조건을 따졌다.

- 마크다운으로 된 글을 타입과 함께 다룰 수 있는 추상화 라이브러리 제공
- 기존에 쓰인 글 형식 유지 가능
- 유지보수가 잘 되고 있음(내가 기여를 할 수 있는 상황이라면 더 좋음)

그중 velite라는 라이브러리를 찾았고 블로그에 사용하면서 나름 만족스러웠기에 이를 소개하고자 한다. 아직 베타 버전이기는 하지만 contentlayer도 그건 마찬가지였기 때문에 velite를 사용해보는 것도 나쁘지 않을 것이라고 생각한다.

**이 글은 velite의 0.1.0-beta.14 버전을 기준으로 작성되었다. 이후 라이브러리 업데이트에서 breaking change가 있을 수 있다.**

# 1. 소개

velite의 핵심은 JSON, 마크다운, yaml등의 컨텐츠가 담긴 파일들을 읽어서 애플리케이션에서 쉽게 다루고 타입을 통한 검증도 할 수 있도록 컨텐츠의 추상화 레이어를 만들어 주는 것이다. 즉 컨텐츠 관리 시스템(CMS)를 직접 구축하지 않고도 컨텐츠 데이터 작업을 쉽게 할 수 있도록 한다. 또한 컨텐츠에서 추가적인 정보를 추출하거나 변환하는 작업도 할 수 있다.

컨텐츠 자체에 대한 정보를 담은 제목, 간단한 설명 등의 메타데이터도 함께 추출해주며 [zod](https://zod.dev/) 라이브러리의 스키마를 통해서 타입과 유효성 검사도 해준다.

# 2. 기본적인 사용

베타 버전치고는 [공식 문서](https://velite.js.org/)의 설명이 꽤 친절하게 되어 있다. 따라서 공식 문서에 있는 기본적인 사용법을 간략히만 다룬다.

npm, yarn, pnpm 등으로 velite를 설치했다는 가정하에 진행한다.

## 2.1. collection 정의

velite는 collection을 이용해서 컨텐츠가 어떤 형식으로 표현될지 정할 수 있다. `defineCollection` 함수를 사용하여 collection을 구성한다.

컨텐츠의 형식을 정의할 때는 zod의 `z`를 확장한 `s` 라는 객체를 사용하며 이는 `s.slug()`, `s.markdown()`등의 커스텀 스키마를 제공한다.

블로그 글이라면 다음과 같이 collection을 정의할 수 있다. 이 collection은 실제 내 블로그에 정의된 collection을 약간 편집한 것이다. 파일의 경로, 글 제목, 글 작성 날짜, 글 태그들, 마크다운을 HTML 문서의 문자열로 변환한 것 등이 들어 있다. zod를 모르더라도 각 스키마에 어떤 제한을 걸고 있는지 대략적으로 이해할 수 있다.

```ts
// velite.config.ts 파일에서 collection을 정의한다
import { defineCollection, s } from "velite";

const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s.object({
    slug: s.path(),
    title: s.string().max(99),
    date: s.string().datetime(),
    tags: s.array(s.string()),
    html: s.markdown({
      gfm: true,
    }),
    thumbnail: s.image(),
  }),
});
```

name, pattern 속성도 확인할 수 있는데 name은 collection의 타입명이 되고 pattern은 해당 패턴을 갖는 경로의 컨텐츠를 이 collection으로 인식하여 변환하겠다는 의미를 가진다.

따라서 다음 collection을 velite로 변환 시 `content/posts/`(단 이후 설명할 설정 파일에서 컨텐츠 루트 디렉토리가 다른 경로로 설정되어 있을 경우 이 경로는 달라질 수 있다) 디렉토리에 있는 모든 `*.md` 파일이 이 collection에 따라 변환되고 해당 파일의 데이터 타입은 `Post` 라는 이름을 갖게 된다.

이후 컨텐츠의 변환 결과가 담긴 `.velite`의 `index.d.ts` 파일에 가면 이 collection의 타입이 `Post`라는 이름으로 정의되어 있다.

```ts
export declare const blogPost: Post[]
```

참고로 `defineCollection`과 거기 쓰인 `Collection` 타입은 다음과 같이 정의되어 있다.

```ts
// velite 레포지토리의 src/types.ts
export const defineCollection = <T extends Collection>(collection: T): T => collection

interface Collection {
  name: string
  pattern: string | string[]
  single?: boolean
  schema: Schema
}
```

위에서 쓰이지 않은 `single` 속성은 해당 collection이 단일 데이터만을 가지는지 여부를 나타낸다. 이 속성이 true이면 해당 collection은 단일 요소만을 가지게 된다. 사이트 메타데이터와 같이 단 하나의 요소만을 가지는 경우에 사용할 수 있지만 일반적인 경우는 아니므로 기본값은 false이고 생략해도 된다.

## 2.2. 설정 정의

[velite Configuration 문서](https://velite.js.org/reference/config)

velite는 애플리케이션에서 쉽게 가져다 사용할 수 있는 형태로 컨텐츠를 변환한다. 그때 velite는 프로젝트 루트의 `velite.config.ts` 파일을 읽어서 설정을 참조한다. 그리고 이 설정은 `velite.config.ts`에서 `defineConfig` 함수를 통해 객체로 정의할 수 있다.

해당 함수로 정의한 설정 객체를 `export default`로 내보내면 velite에서 알아서 컨텐츠 변환시 해당 설정을 사용한다.

```ts
// velite.config.ts
import { defineConfig } from "velite";

export default defineConfig({
  root: "content", // 컨텐츠 데이터가 있는 디렉토리. 기본값은 content
  output: {
    // 컨텐츠를 변환한 데이터의 저장에 대한 설정
    // clean(기본값 false)을 제외하면 전부 기본값이다
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  // 변환할 collection들
  collections: [blogPost],
  // md, mdx의 변환에 사용될 remark, rehype 플러그인 설정
  // GitHub Flavored Markdown은 기본적으로 활성화되어 있다
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  prepare: ({ blogPost }) => {
    // 변환된 컨텐츠에 대한 추가적인 처리
    // 변환된 컨텐츠 내용이 파일에 쓰이기 전에 처리된다
    // 수정, 추가적인 데이터 생성 등이 가능하다
    // prepare, complete 메서드는 #4 에서 다룬다.
  },
  complete: ({ blogPost }) => {
    // 컨텐츠의 변환과 파일 생성이 끝난 후 처리된다
    // CDN에 이미지 업로드, 결과 파일 배포 등의 추가적인 작업
  },
});
```

## 2.3. 설정 객체 타입 정의

`defineConfig` 함수 타입과 여기 쓰인 `UserConfig` 타입은 다음과 같이 정의되어 있다.

```ts
// velite 레포지토리의 src/types.ts
export const defineConfig = <T extends Collections>(config: UserConfig<T>): UserConfig<T> => config

export interface UserConfig<T extends Collections = Collections>
  extends Partial<PluginConfig> {
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

설정 객체를 정의하는 타입도 따로 정의되어 있으므로 `defineConfig`함수를 사용하는 대신 대신 `UserConfig` 타입을 이용해서 설정 객체를 직접 정의하고 내보내도 된다.

```ts
// velite.config.ts
import { UserConfig } from 'velite'

const config:UserConfig={
  // ...
}

export default config;
```

하지만 공식 문서에 의하면 `defineConfig`를 사용하는 편이 더 나은 타입 추론을 제공하기 때문에 `defineConfig`를 사용하는 것이 낫다고 한다.

## 2.4. 컨텐츠 변환과 사용

프로젝트 루트의 `velite.config.ts`에 collection을 정의하고 이를 이용해서 설정 객체까지 정의했다면 이제 velite로 컨텐츠를 변환할 수 있다. 프로젝트 경로의 터미널에서 다음 명령어를 실행할 경우 설정 파일에서 설정한 컨텐츠 경로(기본값은 `content` 폴더)에 있는 컨텐츠를 변환하여 설정 파일에서 설정한 output 경로에 저장한다.

```bash
# 프로젝트에서 사용하는 패키지 매니저에 따라 npx, yarn 등을 사용해도 잘 동작한다
pnpm velite
```

변환된 데이터는 설정 파일의 설정 객체에서 정의한 `output.data` 경로에 저장된다. 이 기본값은 프로젝트 루트의 `.velite`이다. 편리한 사용을 위해 경로의 alias를 설정해 주자. 경로 alias는 `tsconfig.json`에서 설정할 수 있다. velite 공식 문서에서는 `#site/content`를 alias로 쓰는 걸 권장하고 있다.

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

이제 애플리케이션에서는 변환된 데이터를 가져와서 사용할 수 있다. 위에서 변환한 `blogPost` collection이라면 다음과 같이 불러온다. 이렇게 불러온 `blogPost`는 collection에서 정의한 대로 `Post`의 배열 타입을 가진다.

```ts
// blogPost는 Post[] 타입
// 이 blogPost를 이용해서 블로그 글의 변환된 데이터를 렌더링하거나 다룰 수 있다
import { blogPost } from "#site/content";
```

Next.js에 velite 플러그인을 추가해서 사용하는 방법에 대해서는 공식 [Integration with Next.js](https://velite.js.org/guide/with-nextjs) 문서를 참고하면 된다. Next.js와 velite를 함께 사용하기 위해서는 이 설정이 필수적이다.

# 3. transform을 이용한 속성 정의

velite 설정 파일에서 `defineCollection`으로 컨텐츠를 어떤 형식으로 변환할지 정의하였다. `defineConfig`로는 컨텐츠의 변환 과정에 대한 설정을 했다. 어떤 폴더에서 컨텐츠를 가져오고 어떤 폴더에 변환 결과를 넣을지, 마크다운 변환시 플러그인은 뭘 쓸지 등을 정의할 수 있었다. 그러면 나머지는 velite에서 알아서 거기에 따라 컨텐츠를 변환해 주고 우리는 그걸 타입과 함께 가져다 썼다.

이렇게 형식을 정의해서 컨텐츠를 변환할 수 있는 것만 해도 충분히 유용하다. 하지만 velite에서는 스키마에 맞게 생성된 데이터를 이용해서 추가 속성이나 커스텀 속성을 정의하는 등 좀더 많은 작업을 할 수 있다.

## 3.1. 변환된 데이터를 이용한 추가 속성 정의

velite에서 데이터 스키마를 위해 지원하는 `s` 객체는 zod의 모든 기능을 지원한다. velite의 컨텐츠 변환도 zod의 `.safeParseAsync`를 이용한다. 따라서 스키마의 데이터를 변환하는 데 쓰이는 `.transform()`도 당연히 지원한다. 이 메서드를 이용해서 기존에 정의한 데이터 스키마의 값들을 통해 새로운 값이나 커스텀 값을 만들어낼 수 있다.

`defineCollection()`에 붙는 `.transform()` 메서드는 첫번째 인수로 `data`를 받으며 이는 collection에 맞게 변환된 데이터를 의미한다. 이 콜백에서 새로운 데이터를 반환하면 이 데이터가 새로운 변환 결과 데이터로 사용된다. 예를 들어 앞서 만들었던 `blogPost` collection에 `url` 속성을 추가하고 싶다면 다음과 같이 `slug`를 이용해서 만들 수 있다.

```ts
const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      date: s.string().datetime(),
      tags: s.array(s.string()),
      html: s.markdown({
        gfm: true,
      }),
      thumbnail: s.image(),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});
```

`url`이 타입에 추가되어야 한다면 collection의 schema에 optional로 추가해주면 된다. 다음과 같이 말이다.

```ts
const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      // ...
      url: s.string().optional(),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});

```

원래 zod에서는 `transform` 메서드를 이용해서 새로운 속성을 추가해도 타입 검증이 이루어지도록 할 수 있다. 하지만 velite에서는 아직 지원되지 않는 듯 했다.

## 3.2. 메타데이터를 이용한 추가 속성 정의

`transform` 메서드가 인자로 받는 콜백 함수는 컨텐츠의 변환 결과 외에도 `meta` 속성을 갖는 객체를 2번째 인자로 받는다. 이 속성은 컨텐츠의 변환 결과에 관한 메타데이터를 갖는다. 컨텐츠에서 단순 텍스트만 뽑아낸 `meta.plain` 등이 있다.

타입을 보면 앞서 다룬 `transform` 메서드는 `ZodType` 클래스에 정의되어 있다. `transform` 메서드의 콜백 함수 인자의 타입을 따라가면 2번째 인자로 들어오는 객체의 `meta` 속성은 `ZodMeta` 타입을 갖는다. 즉 `meta`는 다음과 같은 형태를 갖는다고 할 수 있다.

```ts
// 공식 문서 링크 https://velite.js.org/reference/types#velitefile
interface ZodMeta extends File {}

class File extends VFile {
  get records(): unknown
  get content(): string | undefined
  get mdast(): Root | undefined
  get hast(): Nodes | undefined
  get plain(): string | undefined
  static get(path: string): File | undefined
  static async create({ path, config }: { path: string; config: Config }): Promise<File>
}
```

이 `meta`를 이용하는 새로운 스키마를 만들 수 있다.

```ts
const posts = defineCollection({
  schema: s.object({
    // ...
    example: s.custom().transform((data, { meta }) => {
      // meta에 있는 컨텐츠 메타데이터를 이용해서 새로운 속성을 만든다
    }),
  }),
});
```

### 3.2.1. 커스텀 스키마 만들기

예를 들어서 페이지 메타데이터 등에 사용하기 위해서 글의 시작 부분에서 특정 길이만큼의 문자열을 추출하고 싶다고 하자. 앞에서 본 `ZodMeta`에서는 `meta.plain` getter 속성을 통해서 컨텐츠의 텍스트 본문만 뽑아 가져올 수 있다. 이 `plain` 문자열에서 특정 길이만큼 추출해서 `excerpt` 속성을 만들어내는 커스텀 스키마를 만들면 된다. 여기서는 100자 이내로 추출하도록 했다.

```ts
const posts = defineCollection({
  schema: s.object({
    // ...
    excerpt: s.custom().transform((data, { meta }) => {
      const { plain } = meta;
      return plain.slice(0, 100);
    }),
  }),
});
```

이는 이미 velite에서 `s.excerpt({ length: number })`라는 스키마를 통해 지원하고 있다. `meta`의 속성을 이용하는 가장 단순한 예시 중 하나이기 때문에 설명을 위해 약간 변경해 가져온 것이다.

좀 더 유용한 예시는 `meta.mdast`를 이용해서 마크다운 AST를 순회하며 특정 속성을 만드는 것이다. 이 `mdast` 메타데이터는 마크다운을 파싱해서 만든 AST를 가리킨다.

예를 들면 `mdast`를 순회하면서 글의 목차를 위해 쓰일 목차 트리를 만드는 작업을 직접 해볼 수 있다. velite에서는 `s.toc()` 스키마를 지원하지만 중복 요소 처리와 HTML 요소에 `id` 속성을 추가하는 등의 부분에서 커스텀이 어려운 부분이 있다. 따라서 원하는 toc 로직이 있을 경우 이렇게 직접 만들어 사용하는 것도 장점이 있다.

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
  // unist-util-visit를 이용해서 mdast를 순회하며 toc를 만든다
  visit(tree, 'heading', (node: Heading) => {
    processHeadingNode(node, output, depthMap, headingID);
  });
  return output;
}
```

[`defineSchema`를 이용해서 타입 추론과 함께 커스텀 스키마를 분리할 수도 있다.](https://velite.js.org/guide/custom-schema) 이렇게 하면 앞서 `s.slug()`나 `s.markdown()`과 같이 스키마를 collection에서 사용했던 것처럼 `headingTree()`로 스키마를 사용할 수 있게 된다.

```ts
import { defineSchema, s } from 'velite'

const headingTree = defineSchema(() =>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  })
);
```

### 3.2.2. 추가 속성 만들기

`.transform()` 메서드는 앞서 언급한 커스텀 스키마를 만들 때도 사용할 수 있다. 애초에 스키마를 이용해서 컨텐츠를 파싱할 때 그 결과를 변환하기 위한 용도이기 때문이다.

그런데 이를 스키마 객체의 원소로 사용하는 것이 아니라 velite 설정의 스키마 객체 그 자체에 사용하면 스키마에 의해 변환이 완료된 컨텐츠 데이터에 추가적인 유효성 검사나 추가 속성을 적용할 수 있다. 변환된 결과물과 메타데이터를 둘 다 이용해서 추가적인 속성을 만들 때 유용하다.

이 블로그 같은 경우 각 글에 해당하는 대표 이미지가 있고 그것이 글 목록의 썸네일이자 open graph 이미지로 들어간다. 여기 쓰일 이미지를 위한 `thumbnail` 속성을 만들어내는 작업을 `transform` 메서드를 이용해서 할 수 있다.

글에 이미지가 있으면 그 중 첫번째 이미지를 대표 이미지로 사용하고 없다면 글의 제목, 목차, slug 등을 이용해서 `canvas`로 이미지로 만든 후 이를 대표 이미지로 사용한다. 이를 위해서는 `meta.mdast`와 컨텐츠 변환 결과물에 있는 글의 제목, 목차 등이 둘 다 필요하다. 따라서 앞서 말한 유용성에 정확하게 부합한다.

다음 코드는 내 블로그에서 실제로 썸네일을 생성하고 있는 코드를 약간 편집해서 가져온 것이다. 이런 식으로 스키마 객체에 transform을 적용하여 컨텐츠 변환 결과에 추가적인 속성을 만들어낼 수 있다.

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

export async function generateThumbnailURL(meta: ZodMeta, title: string, headingTree: TocEntry[], filePath: string) {
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

# 4. 컨텐츠 변환 후 추가 작업

`velite.config.ts`의 설정 객체는 다음과 같은 메서드를 제공한다. `defineConfig` 함수의 인자로 들어가는 객체 속성으로 사용할 수 있다.

- `prepare`: 컨텐츠 변환 후 JSON 파일에 변환 결과를 쓰기 전에 추가 작업을 할 수 있는 메서드
- `complete`: 컨텐츠를 변환한 문서까지 만들어진 후 마지막 추가 작업을 할 수 있는 메서드

## 4.1. prepare

설정 객체의 `prepare` 메서드는 말 그대로 컨텐츠의 변환 데이터가 파일에 쓰이기 전에 필요한 작업을 수행한다. 예를 들어 데이터를 수정하거나 필터링하거나 뭔가 빠진 속성을 추가하는 등의 작업을 할 수 있다.

변환된 데이터를 속성으로 갖는 객체를 인자로 받는다. 예를 들어 앞에서는 `blogPost` collection을 이용해서 컨텐츠를 변환했는데 이 변환된 데이터가 바로 `prepare` 메서드의 인자로 들어간다. 그리고 `prepare` 에서 리턴한 데이터가 실제 변환 데이터로 사용된다.

`prepare`를 쓸 수 있는 대표적인 예시로 어떤 문서가 아직 작성중인지를 뜻하는 `draft` 속성을 가지고 있다면 실제 변환 결과에는 포함되지 않도록 하는 작업을 들 수 있다. 이는 공식 문서의 예시 코드에서도 사용한 예시다.

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

또는 글에 태그 속성이 있다면 전체 태그를 뽑아내서 어딘가에 이용한 후 그 결과물을 변환 결과 파일에 작성하는 등의 작업도 가능하다.

## 4.2. complete

설정 객체의 `complete` 메서드는 컨텐츠의 변환이 모두 끝나고 데이터가 파일에 작성되는 작업까지 끝난 후에 필요한 작업을 수행한다. 예를 들어 변환된 데이터를 CDN에 업로드하거나 결과 파일을 배포하는 등의 작업을 할 수 있다. `prepare`와 똑같이 변환된 데이터를 속성으로 갖는 객체를 인자로 받는다.

단 해당 시점에는 이미 컨텐츠 변환과 변환 결과 파일 작성이 끝난 시점이므로 `fs.writeFile`과 같은 함수를 통해 변환 결과 파일을 직접 조작하지 않는 이상 변환된 결과물을 수정하는 작업을 자연스럽게 할 수는 없다. 대신 변환된 결과물을 OSS에 업로드하거나 이미지를 CDN에 업로드하는 등의 작업을 할 수 있다.

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
    // 글의 각 썸네일 이미지를 CDN에 업로드
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

# 5. velite의 전반적인 평가

velite는 베타 버전이며 거의 모든 기능이 1명에 의해 개발된 것 치고 아주 잘 작동한다. 아직 부족한 부분들이 있는 건 사실이다. `transform`을 통해 생긴 속성의 타입 검증이나 성능 등등. **하지만 velite는 매우 활발히 개발되고 있다.** 앞서 설명한 `defineSchema`를 이용한 커스텀 스키마 기능도 이 글을 쓰는 시점에서 고작 며칠 전에 추가된 기능이다. 그리고 다른 컨텐츠 변환 라이브러리들에 비해 코드도 간단한 편이라 커스텀, 심지어 기여하기도 쉬울 거라 느껴진다.

다만 아직 정형화되지 않은 부분이 많아서 변환 커스텀의 자유도는 높지만 내부 코드를 이해하지 않으면 원하는 대로 커스텀하기 어려운 부분이 많다. 특히 변환 과정에 개입할 때 어디까지 컨텐츠 변환이 진행되었으며(이미지는 `/public`으로 옮겨졌는지, toc는 구성되었는지, 컨텐츠 파싱은 완료되었는지 등) 지금 어떤 정보를 보유하고 있는지 정확히 알고 커스텀하는 게 쉽지 않았다. `safeParseAsync`를 이용해 컨텐츠를 변환하니 zod에 대한 이해도 필요하고 말이다.

velite는 앞으로 얼마나 발전할까? 사실 알 수 없는 일이다. velite는 현재 1명이 대부분의 개발을 진행하고 있고 contentlayer가 갑자기 자본을 등에 업고 나타나면 순식간에 밀려날지도 모른다. 하지만 지금 시점에서 velite는 꽤 쓸만하고 다른 컨텐츠 변환 라이브러리에 비해 충분히 장점도 있다. 내가 더 많은 장점을 만드는 데 기여할 수도 있을 것이다. 지금으로서는, velite는 지금도 쓸만하고 앞으로 더 좋아질 가능성이 크다, 정도로 평가할 수 있을 것 같다.

# 6. 비교

## 6.1. contentlayer

velite와 contentlayer는 둘 모두 마크다운, mdx, yaml 등의 컨텐츠를 다루기 위한 추상화 레이어와 타입을 제공한다. 추상화 레이어이기 때문에 프레임워크에 대한 의존성이 없어서 Next.js건 Vue건 프레임워크에 상관없이 사용할 수 있다는 점도 비슷하다. 또 둘 다 베타 버전이기 때문에 얼마든지 breaking change가 있을 수 있다.

기능에 있어서는 velite가 어느 정도 우위가 있다고 본다. 현재 시점에서 velite의 개발과 유지보수가 훨씬 활발하다는 것도 velite의 장점이다.

가령 [Next.js에서 contentlayer를 이용할 때는 이미지 등의 정적 파일을 상대 경로를 통해 이용할 수 없었기 때문에 플러그인을 따로 작성하여 `/public`으로 정적 파일을 옮겨 주어야 했다.](https://witch.work/posts/blog-remake-4) 하지만 velite는 [markdown.copyLinkedFiles](https://velite.js.org/reference/config#markdown-copylinkedfiles)을 이용하여 자동으로 정적 파일을 `/public`으로 옮겨준다. `mdast`나 `hast`를 이용한 커스텀 작업도 velite에서 더 쉽게 할 수 있다. 아예 공식 문서에 설명도 되어 있다.

또한 contentlayer는 마크다운 파일의 내용은 전부 변환 데이터에 포함되어야 했던 것에 비해 velite는 마크다운 파일의 내용까지도 하나의 스키마로 정의된다. 따라서 마크다운 파일의 메타데이터만 필요할 경우(가령 글 목록을 보여준다던가, 제목 검색 기능이 필요한 경우 등) 해당 메타데이터만 추출하여 새로운 collection을 만들면 훨씬 더 경량으로 해당 페이지 데이터를 구성할 수 있다. 한마디로 velite가 좀더 기능도 많고 자유도도 높다. 

이에 비해 contentlayer는 확실히 안정성이 장점이다. 베타 버전이라고는 하지만 이미 많은 업데이트와 예시, 기여자들이 있었고 심지어 한글로 된 설명 글들도 꽤 있다. [shadcn/ui를 이용해 작성된 유명한 예제에서도 contentlayer를 사용하고 있다.](https://github.com/shadcn-ui/taxonomy)

이는 컨텐츠 변환을 커스텀할 때도 드러난다. 앞서 velite에서 정확하게 원하는 대로 커스텀하는 게 쉽지 않다는 언급을 했다. 하지만 contentlayer는 변환 과정 중 `VFile` 인스턴스를 생성하는 등 변환의 각 과정에서 무엇을 할 수 있고 어떤 정보를 가지고 있는지가 좀 더 명확하다. 자유도가 좀 낮은 대신 좀 더 탄탄하게 커스텀할 수 있다는 느낌이다.

## 6.2. @next/mdx

[Next.js 공식 문서에서도 마크다운을 변환하는 방법을 소개하고 있었다.](https://nextjs.org/docs/app/building-your-application/configuring/mdx) `@next/mdx`라는 라이브러리를 사용하는 방식이다. Next.js의 공식 문서에도 소개되어 있고 Vercel의 레포지토리에 속해 있는 만큼 contentlayer와 같이 갑자기 유지보수가 중단되지 않을 것이다.

하지만 당연히 단점도 있다.

먼저 contentlayer나 velite에서는 프로젝트 루트의 `/posts`나 `/content` 경로에서 글을 관리했었다. `@next/mdx`를 사용할 경우 모든 글을 Next.js의 `app/` 디렉토리에 넣어야 한다. 이 점은 next-mdx-remote 라이브러리를 사용하여 해결할 수 있기는 하다. 하지만 rsc 지원이 아직 불안정하고 또한 next-mdx-remote는 원격으로 컨텐츠 데이터를 가져오기 위한 라이브러리인데 이를 다른 로컬 경로에 있는 파일을 가져오기 위한 라이브러리로 사용하는 것은 좋지 않다.

또한 이 라이브러리를 사용하는 경우 문서를 원하는 대로 커스터마이징하기 어렵다. 앞서 본 contentlayer, velite는 `.md` 파일 내용을 HTML 형식의 문자열로 변환해 주고 이를 사용자가 가져다가 커스터마이징할 수 있었다. 하지만 `@next/mdx`는 `.md`나 `.mdx` 파일을 하나의 페이지로 만드는 형식이기 때문에 커스텀이 상대적으로 어렵다.

각 컴포넌트의 스타일링도 CSS를 통해서 쉽게 할 수 있었던 contentlayer와 달리 `mdx-components.tsx` 파일을 만들어서 커스텀 컴포넌트를 만들어야 한다. 앞서 보았던 라이브러리들보다 전반적으로 자유도가 많이 떨어지고 Next.js에 종속적이라고 보인다.

## 6.3. marked

[블로그 개편기 - 4. marked를 활용한 마크다운 변환기 구현하기](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4)에서 사용하고 있는 marked 라이브러리도 방법이었다. 주어진 마크다운을 파싱하여 HTML 파일로 만들어 주는 방식이었다.

이 과정에서 renderer와 tokenizer라는 API를 사용하여 스타일이나 필요한 형식을 커스텀할 수 있다. 커스텀 자유도도 꽤 훌륭해 보였다. 그러나 라이브러리의 기능이 단순 변환뿐이었기에 기존 라이브러리들이 제공하는 동작을 위해서는 또 다른 코드를 작성해야 한다. 또 `.md` 파일 대신 변환 결과물인 HTML 파일을 따로 가지고 있어야 한다는 것도 불만스러웠다. remark, rehype 등 기존에 사용하던 플러그인과 컴포넌트와 호환도 되지 않았다.

언급한 블로그 글들을 보면 marked 라이브러리의 결과물은 나쁘지 않아 보였고 공식 문서를 훑어보았을 때 성능도 제법인 것으로 보였다. 하지만 어차피 블로그에서는 변환된 결과물을 사용하고, 기존 빌드가 그렇게까지 오래 걸리는 것도 아니었다. 블로그의 기존 글과의 호환성도 떨어졌다. 따라서 내 블로그에서는 기존 라이브러리들에 비해 특별한 장점을 찾기는 어려웠다.

# 참고

[Why Working with Content is Hard for Developers](https://contentlayer.dev/blog/working-with-content-is-hard-for-developers)

[velite 공식 문서](https://velite.js.org/)

[NextJS 14 Markdown Blog: TypeScript, Tailwind, shadcn/ui, MDX, Velite 영상](https://www.youtube.com/watch?v=tSI98g3PDyE)

[Zod로 입출력 간 데이터 변환하기](https://www.daleseo.com/zod-transformation/)

[블로그 개편기 - 4. marked를 활용한 마크다운 변환기 구현하기](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4)

[NextJS 공식 문서, Markdown and MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx)