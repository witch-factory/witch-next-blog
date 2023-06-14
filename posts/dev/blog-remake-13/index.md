---
title: 블로그 만들기 - 13. 아이콘 색상, 링크 추가, 코드 리팩토링
date: "2023-06-12T05:00:00Z"
description: "자잘한 수리를 해보자."
tags: ["blog", "web"]
---

# 블로그 만들기 시리즈

|제목|링크|
|---|---|
|1. 기본 세팅|[https://witch.work/posts/dev/blog-remake-1](https://witch.work/posts/dev/blog-remake-1)|
|2. 메인 페이지의 HTML 설계|[https://witch.work/posts/dev/blog-remake-2](https://witch.work/posts/dev/blog-remake-2)|
|3. 글 상세 페이지의 구조 설계|[https://witch.work/posts/dev/blog-remake-3](https://witch.work/posts/dev/blog-remake-3)|
|4. 이미지를 상대 경로로 쓸 수 있도록 하기|[https://witch.work/posts/dev/blog-remake-1](https://witch.work/posts/dev/blog-remake-4)|
|5. 자잘한 페이지 구성 개선과 배포|[https://witch.work/posts/dev/blog-remake-5](https://witch.work/posts/dev/blog-remake-5)|
|6. 페이지 요소의 배치 설계|[https://witch.work/posts/dev/blog-remake-6](https://witch.work/posts/dev/blog-remake-6)|
|7. 메인 페이지 컴포넌트 디자인|[https://witch.work/posts/dev/blog-remake-7](https://witch.work/posts/dev/blog-remake-7)|
|8. 글 목록/내용 페이지 컴포넌트 디자인|[https://witch.work/posts/dev/blog-remake-8](https://witch.work/posts/dev/blog-remake-8)|
|9. 글 썸네일 자동 생성하기|[https://witch.work/posts/dev/blog-remake-9](https://witch.work/posts/dev/blog-remake-9)|
|10. 폰트, 카드 디자인 등의 디자인 개선|[https://witch.work/posts/dev/blog-remake-10](https://witch.work/posts/dev/blog-remake-10)|
|11. 글에 조회수 달기|[https://witch.work/posts/dev/blog-remake-11](https://witch.work/posts/dev/blog-remake-11)|
|12. 페이지 테마와 글 검색 기능|[https://witch.work/posts/dev/blog-remake-12](https://witch.work/posts/dev/blog-remake-12)|
|13. 테마 아이콘과 썸네일 레이아웃 개선, 코드 리팩터|[https://witch.work/posts/dev/blog-remake-13](https://witch.work/posts/dev/blog-remake-13)|
|메인 페이지의 연산 최적화|[https://witch.work/posts/dev/blog-opt-1](https://witch.work/posts/dev/blog-opt-1)|
|글 목록 페이지네이션 만들기|[https://witch.work/posts/dev/blog-opt-2](https://witch.work/posts/dev/blog-opt-2)|
|이미지를 CDN에 올리고 placeholder 만들기|[https://witch.work/posts/dev/blog-opt-3](https://witch.work/posts/dev/blog-opt-3)|
|검색 페이지에 무한 스크롤 구현하기|[https://witch.work/posts/dev/blog-opt-4](https://witch.work/posts/dev/blog-opt-4)|

# 1. 헤더 아이콘 색상

화면 너비가 작아지게 되면 헤더의 메뉴가 드롭다운으로 바뀌는데 이 아이콘 색상은 테마에 상관없이 검은색으로 일정하게 되어 있다. 따라서 다크모드에선 불편하다.

이걸 테마에 따라 아이콘 색상이 달라지게 해보자. [icons8](https://icons8.com/)에서 iOS의 햄버거 메뉴/닫기 아이콘을 가져와서 `Toggler` 컴포넌트에 적용한다.

```tsx
// src/components/header/menu/toggler/index.tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const hamburgerIcon: {[key: string]: string} = {
  'light':'/icons/icons8-hamburger.svg',
  'dark':'/icons/icons8-hamburger-dark.svg',
  'pink':'/icons/icons8-hamburger-pink.svg',
};

const cancelIcon: {[key: string]: string} = {
  'light':'/icons/icons8-cancel.svg',
  'dark':'/icons/icons8-cancel-dark.svg',
  'pink':'/icons/icons8-cancel-pink.svg',
};

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {theme} = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIcon[theme || 'light'] :
          hamburgerIcon[theme || 'light']
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;
```

그리고 이를 클라이언트 사이드에서 보이도록 하기 위해 메뉴 컴포넌트에서는 dynamic import를 한다.

```tsx
// src/components/header/menu/index.tsx

import dynamic from 'next/dynamic';

/* import문 일부 생략 */
/* dynamic import */
const Toggler = dynamic(() => import('./toggler'), { ssr: false });

/* 타입 생략 */

function Menu({navList}: {navList: PropsItem[]}) {
  /* 컴포넌트 내용은 이전과 똑같으므로 생략 */
}

export default Menu;
```

# 2. 자동 생성 썸네일의 간격 조정

현재 자동 생성 썸네일은 `src/plugins/make-thumbnail.mjs`에서 remark 플러그인 함수를 통해 생성하고 있다. 그런데 지금 코드의 경우 제목이 너무 길어서 여러 줄로 썸네일에 들어갈 경우 밑의 컨텐츠(헤딩 목록)가 유연하게 간격이 조절되지 않고 무조건 고정된 위치에 렌더링된다.

이 코드를 수정하자. `drawHeadings` 함수만 수정하면 된다.

```js
// src/plugins/make-thumbnail.mjs
/* 나머지 함수들 생략 */
function drawHeadings(ctx, title, headingTree) {
  title=stringWrap(title, 15);
  title=title.split('\n');
  
  if (title.length>3) {return;}

  const thumbnailHeadings=headingTree.slice(0, 2);
  const headingTexts=[];
  for (let h of thumbnailHeadings) {
    const headingText=h.data.hProperties.title.replaceAll('. ', '-');
    headingTexts.push(headingText);
  }
  headingTexts[headingTexts.length-1]+='...';
  ctx.font = '20px NotoSansKR';
  for (let i=0; i<headingTexts.length; i++) {
    ctx.fillText(headingTexts[i], 20, 50+50*title.length+25*i);
  }
}
```

그리고 `drawHeading`을 쓸 때 title도 같이 인수로 넣어준다.

```js
drawHeadings(ctx, title, headings);
```

# 3. 카테고리에 링크 추가

메인 페이지의 `Category`에서 표시하는 게시판 제목에 링크를 추가하자. 해당 컴포넌트에서는 props로 category의 URL을 이미 받고 있으므로 쉽다.

링크가 있음을 표시하기 위해서 링크 표시 유니코드 `U+1F517`을 사용하였다.

```tsx
// src/components/category/index.tsx
function Category(props: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        <Link href={props.url}>
          {props.title} {'\u{1F517}'}
        </Link>
      </h2>
      
      <ul className={styles.list}>
        {props.items.map((item) => {
          return (
            <li key={item.url}>
              <Card
                {...propsProperty(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

그리고 hover시 텍스트 색상 스타일링 추가

```css
// src/components/category/styles.module.css
.container{
  margin-bottom:2rem;
}

.title:hover{
  color:var(--textLightIndigo);
}

.list{
  list-style:none;
  padding:0;
  display: grid;
  gap:1rem;
  margin:0;
}

@media (min-width:768px){
  .list{
    grid-template-columns:repeat(3,1fr);
  }
}
```

# 4. 푸터의 테마 설정 함수 지정

푸터에서 쓰던 기존의 테마 설정 함수는 테마 이름에 따라 하나하나 만들어 주고 있었다. 이를 테마 이름에 따라 자동으로 만들어주는 함수로 바꾸자.

```tsx
// src/components/footer/index.tsx
/* 기존에 쓰던 함수들 */
const pinkTheme = () => {
  setTheme('pink');
};

const witchTheme = () => {
  setTheme('witch');
};

/* 새로 일반화한 함수 */
const changeTheme = useCallback((theme: string) => {
  return ()=>{
    setTheme(theme);
  };
}, []);
```

# 5. 반복되는 부분 통합

## 5.1. 테마에 따른 아이콘 색상

현재 테마에 따른 아이콘을 택하는 건 `Toggler` 컴포넌트와 `Search` 컴포넌트에서 객체를 통해 이루어지고 있다. 그런데 각각의 아이콘을 위한 함수들이 반복적으로 정의되었다.

아래에 쓰인 외에도 `searchIconSrc` 함수도 있다...같은 로직으로 3번이나 비슷한 함수가 있는 것이다.

```tsx
// src/components/header/menu/toggler/index.tsx
function hamburgerIconSrc(isDark: boolean, isPink: boolean, isWitch: boolean) {
  if (isDark || isWitch) {
    return hamburgerIconMap['dark'];
  }
  else if (isPink) {
    return hamburgerIconMap['pink'];
  }
  else {
    return hamburgerIconMap['light'];
  }
}

function cancelIconSrc(isDark: boolean, isPink: boolean, isWitch: boolean) {
  if (isDark || isWitch) {
    return cancelIconMap['dark'];
  }
  else if (isPink) {
    return cancelIconMap['pink'];
  }
  else {
    return cancelIconMap['light'];
  }
}
```

이를 함수를 통해 분리하자. `utils/getThemeName.ts`에 아래와 같이 함수를 정의한다. theme이 undefined도 가능하도록 한 이유는 여기에 들어가는 theme은 next-themes에 있는  `resolvedTheme`인데 이는 undefined일 수도 있기 때문이다.

만약 theme이 undefined라면 light로 간주한다.

```ts
export const getThemeName = (theme: string | undefined) => {
  if (theme === 'witch') {
    return 'dark';
  }
  return theme ?? 'light';
}
```

그리고 기존 이미지 객체들도 `utils/iconsURL.ts`으로 옮겨준다.

```ts
// src/utils/iconsURL.ts에 다음 내용 추가
const hamburgerIconMap: {[key: string]: string} = {
  'light':hamburgerIcon,
  'dark':hamburgerIconDark,
  'pink':hamburgerIconPink,
};

const cancelIconMap: {[key: string]: string} = {
  'light':cancelIcon,
  'dark':cancelIconDark,
  'pink':cancelIconPink,
};

const searchIconMap: {[key: string]: string}={
  'light':searchIcon,
  'dark':searchIconDark,
  'pink':searchIconPink,
};

export {
  hamburgerIconMap,
  cancelIconMap,
  searchIconMap,
};
```

그리고 `Toggler` 컴포넌트에서는 이를 아래와 같이 적용한다. 반복되는 논리와 함수 정의가 없어져서 훨씬 깔끔해졌다.

```tsx
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/getThemeName';
import { hamburgerIconMap, cancelIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {resolvedTheme} = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIconMap[getThemeName(resolvedTheme)] :
          hamburgerIconMap[getThemeName(resolvedTheme)]
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;
```

`Search` 컴포넌트에도 다음과 같이 적용한다.

```tsx
// src/components/header/search/index.tsx
const Search = () => {
  const {resolvedTheme} = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIconMap[getThemeName(resolvedTheme)]} 
        alt='Search' 
        width={32} 
        height={32} 
        priority
      />
    </Link> 
  );
};
```

## 5.2. 메인 페이지의 중복 논리 map 제거

`src/pages/index.tsx`에 있는 메인 페이지 코드를 보자. `getStaticProps`에서 `{카테고리명:해당 카테고리 글들의 배열}`형태의 객체를 리턴하고 이를 `Home` 컴포넌트에서 `blogCategoryList.map`을 통해 카테고리별로 `Category` 컴포넌트를 만들고 있다.

이때 카테고리별 글들을 리턴하는 논리가 중복되어 있다. 이를 제거하자.

```tsx
export default function Home({
  categoryPostMap
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* 프로젝트 목록을 만들기 */}
      <ProjectList />
      <article>
        {/* 카테고리별 글 목록을 만들기 */}
        {blogCategoryList.map((category) => {
          const categoryPostList=categoryPostMap[category.url];

          return categoryPostList.length?
            <Category
              key={category.title} 
              title={category.title} 
              url={category.url} 
              items={categoryPostList}
            />:null;
        })}
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {
  const categoryPostMap: {[key: string]: CardProps[]}={};

  blogCategoryList.forEach((category)=>{
    categoryPostMap[category.url]=getSortedPosts()
      .filter((post: DocumentTypes)=>{
        return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes)=>{
        return propsProperty(post);
      });
  });

  return { props: { categoryPostMap } };
};
```

이를 다음과 같이 수정한다. 이제 `Home` 컴포넌트에서는 객체를 통해 계산하는 게 아니라 배열을 이용한 map을 사용한다.

```tsx
function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export default function Home({
  categoryPostList
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageContainer>
      <Profile />
      {/* 프로젝트 목록을 만들기 */}
      <ProjectList />
      <article>
        {/* 카테고리별 글 목록을 만들기 */}
        {categoryPostList.map((category: CategoryProps) => {
          return category.items.length?
            <Category
              key={category.url}
              {...category}
            />:null;
        })
        }
      </article>
    </PageContainer>

  );
}

export const getStaticProps: GetStaticProps = () => {

  const categoryPostList: CategoryProps[]=blogCategoryList.map((category)=>{
    const {title:categoryTitle, url:categoryURL}=category;
    const postList: CardProps[]=getSortedPosts()
      .filter((post: DocumentTypes)=>{
        return post._raw.flattenedPath.split('/')[0]===category.url.split('/').pop();
      })
      .slice(0, 3)
      .map((post: DocumentTypes)=>{
        return propsProperty(post);
      });

    return {title:categoryTitle, url:categoryURL, items: postList};
  });

  return { props: { categoryPostList } };
};
```

위에 쓰인 `CategoryProps`는 `Category` 컴포넌트와 함께 정의된 타입인데 이전에 쓰이던 것과 같다.

```tsx
// src/components/category/index.tsx
export interface CategoryProps{
  title: string;
  url: string;
  items: CardProps[];
}
```

# 6. 페이지네이션 코드에 타입 추가

페이지네이션에 쓰이는 `getPaginationArray`에서 리턴하는 배열은 `...`과 숫자가 담긴 배열을 리턴한다. 따라서 이 둘을 포괄하는 타입을 정의하여 사용해 주자. 

다음과 같이 작성하면 이후 이 함수에서 생성한 `PaginationArray`의 map을 돌릴 때 각 원소가 `number | '...'`타입으로 추론되어서 다른 문자열이 해당 배열에 들어가는 것을 막을 수 있다.

```tsx
// 상수 타입으로 변경
export const dotts='...' as const;

function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
): Array<number | typeof dotts> {
  /* 리턴 타입을 number 혹은 dotts 문자열로 강력히 정의 */
  const totalPages=parseInt((totalItemNumber/perPage).toString()) + (totalItemNumber%perPage?1:0);
  if (totalPages<=7) {
    return getPages(totalPages);
  }
  if (currentPage<=4) {
    return [1, 2, 3, 4, 5, dotts, totalPages-1 ,totalPages];
  }
  if (currentPage>=totalPages-3) {
    return [1, dotts, ...getPages(6, totalPages - 5)];
  }

  return [1, 
    dotts,
    ...getPages(5, currentPage - 2),
    dotts, 
    totalPages
  ];
}
```

# 7. 무한 스크롤의 디바운스

`useDebounce` 훅을 `src/utils/useDebounce.ts`로 분리하고 다음과 같이 스크롤 페이지가 debounce되도록 한다.

```tsx
function PostSearchPage({
  category, postList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [searchKeyword, debouncedKeyword, setSearchKeyword]=useSearchKeyword();
  const [filteredPostList, setFilteredPostList]=useState<CardProps[]>(postList);
  const [page, setPage]=useState<number>(1);
  /* 300ms가 지나야 증가하는 페이지 */
  const debouncedPage = useDebounce(page.toString(), 300);

  const infiniteScrollRef=useRef<HTMLDivElement>(null);
  const totalPage=Math.ceil(filteredPostList.length/ITEMS_PER_PAGE);

  const onKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  }, [setSearchKeyword]);

  useEffect(() => {
    setFilteredPostList(filterPostsByKeyword(postList, debouncedKeyword));
  }, [debouncedKeyword]);

  /* 디바운스된 페이지 기준으로 스크롤 로드 */
  useInfiniteScroll(infiniteScrollRef, useCallback(()=>{
    if (page<totalPage) {
      setPage(prev=>prev+1);
    }
  }, [debouncedPage, totalPage]));

  return (
    <PageContainer>
      <h2 className={styles.title}>{`${category} 검색`}</h2>
      <SearchConsole 
        value={searchKeyword}
        onChange={onKeywordChange}
      />
      <ul className={styles.list}>
        {filteredPostList.slice(0, ITEMS_PER_PAGE * page).map((post: CardProps) => 
          <li key={post.url}>
            <Card {...post} />
          </li>
        )}
      </ul>
      <div className={styles.infScroll} ref={infiniteScrollRef} />
    </PageContainer>
  );
}
```

# 8. blur URL 개선

현재 이미지의 placeholder 역할을 하는 블러 이미지는 `src/utils/generateBlurPlaceholder.ts`에서 만들고 있다. 코드는 다음과 같다.

```ts
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

export default async function getBase64ImageUrl(imageUrl: string) {
  const response= await fetch(imageUrl.replace('w_300,f_auto', 'w_16,f_jpg'));
  const buffer= await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });
  const blurURL = `data:image/jpeg;base64,${Buffer.from(minified).toString('base64')}`;
  return blurURL;
}
```

그런데 여기에 쓰인 imagemin은 이미 시체가 되었다. [공식 github](https://github.com/imagemin/imagemin#readme)의 About을 보면 Unmaintained라고 쓰여 있다.

따라서 새로운 라이브러리를 쓰자. [plaiceholder](https://plaiceholder.co/docs)라는 라이브러리가 있다. plaice는 넙치라고 한다.

```
Q : Why have you misspelled "placeholder"?
A : A Plaice(opens in a new tab) is a flat fish that lays stationary on the sea-bed, much like an image placehol… actually this is bullshit, all the other good names were taken.
```

## 8.1. 라이브러리 세팅

기존에 깔았던 imagemin 관련 라이브러리를 삭제하고 plaiceholder를 설치하자.

```bash
npm uninstall @types/imagemin
npm uninstall @types/imagemin-jpegtran
npm uninstall imagemin-jpegtran
npm uninstall imagemin

npm install sharp
npm install plaiceholder
```

만약 이를 nextJS 사이드의 코드에서 쓰고 싶다면 `@plaiceholder/next`도 설치해야 하겠지만 나는 빌드 시 remark 플러그인을 적용하는 

# 참고

