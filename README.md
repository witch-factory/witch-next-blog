# 🪄 witch.work — 개발 블로그

개인 블로그 프로젝트입니다. Next.js App Router 기반으로 다국어 콘텐츠, SEO 최적화, 번역 스크립트, 이력서 페이지 등을 포함하고 있습니다.

[작은 것 하나까지 원하는 대로 커스텀한 블로그를 가지고 싶어서 next.js를 배우면서 만들었습니다. 만들고 개선하고 트러블슈팅하는 과정들을 블로그에 기록하였습니다. 이 기록은 계속 쓰여지고 있습니다.](https://witch.work/posts/tag/blog)

[witch.work](https://witch.work/)

## 기술 스택

- Language : `TypeScript`
- Framework : `Next.js`(App Router)
- Content pipeline : `content-collections` + custom markdown compiler
- Styling : [`vanilla-extract`](https://vanilla-extract.style/)
- Deploy : `Vercel`(migrating to home server)
- VCS : `Git`
- Image CDN : `Cloudinary`
- package manager : `pnpm`

## 프로젝트 구조

```
src/
├── app/                   # App Router 기반 라우트 (다국어 지원)
│   └── [lang]/            # 언어별 경로 (ko, en)
│       ├── page.tsx       # 홈 페이지
│       ├── api/           # og 이미지 생성, 조회수 카운트 등을 위한 라우트 핸들러
│       ├── posts/         # 블로그 포스트 뷰, 각 태그별 페이지
│       ├── resume/        # 이력서 페이지
│       ├── about/         # 소개 페이지
│       └── search/        # 포스트 검색
├── modules/               # 복합 UI 컴포넌트(header, profile 등)
├── containers/            # 레이아웃을 담당하는 컨테이너 컴포넌트
├── features/              # 기능 단위 컴포넌트 (뷰 카운트, GA, 언어 전환기 등)
├── ui/                    # 최소 단위의 UI 구성 요소 (Button, Badge 등)
├── hooks/                 # 커스텀 훅
├── types/                 # 공통 타입 정의
├── utils/                 # 유틸 함수 (metadata 생성, RSS, 필터 등)
├── config/                # 블로그 설정 및 메타 정보
├── plugins/               # Remark 기반 Markdown 플러그인
├── styles/                # 전역 스타일 및 디자인 토큰 (vanilla-extract)
└── icons/                 # 커스텀 SVG 아이콘
```

## Run

```bash
pnpm install
pnpm dev
```

## Author

MIT @ [SungHyun Kim](https://github.com/witch-factory)
