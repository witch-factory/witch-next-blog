---
title: 블로그 리뉴얼 - 1.시작
date: "2021-06-27T00:00:00Z"
description: "블로그 리뉴얼 - 시작"
tags: ["blog", "web"]
---

### 1. 블로그의 개조
현재 내 블로그는 [gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog) 를 사용해서 구성한 상태이다.
하지만 내가 구성한 블로그가 아니다 보니 코드의 파악도 쉽지 않았고 하나하나 요소들을 추가하면서
점점 꼬이는 느낌이 들었다. 따라서 내가 저 블로그와 비슷한 디자인으로 하나하나 구축해 보기로 했다.

### 2. 기존 튜토리얼
[개츠비 튜토리얼 ver3](https://www.gatsbyjs.com/docs/tutorial/) 이 현재 존재한다.
그러나 이게 아직 끝까지 완성된 상태가 아니다. 따라서 어느 정도는 스스로 찾아가면서 해야 한다.

또 완성한다 해도 디자인이 못생겨서 많은 커스터마이징이 필요하다. [튜토리얼의 샘플 사이트](https://introworkshopexamplesitev3.gatsbyjs.io/)
따라서 나는 기존 튜토리얼의 내용을 따라하고 나서 하나하나 커스터마이징을 하면서 글을 쓸 것이다.
그러니 기존까지 쓰인 튜토리얼 내용은 모두 완료한 상태라고 가정하고 강의를 시작한다.

### 3. 기존 튜토리얼 코드 분석
적을 알고 나를 알아야 이길 수 있다고 했다. 
따라서 기존 튜토리얼이 미완이라 해도, 어떻게 돌아가고 있는지 빠삭하게 알고 있어야 제대로 고칠 수 있을 것이라 생각해서
기존 튜토리얼의 구조에 대하여 여기 간단하게 정리한다.

이때 블로그 구동에 핵심이 되는 내용은 모두 src 폴더 안에 있으므로 그 내용에 대해서만 정리한다.
`gatsby_config.js`의 경우 제목과 사이트 설명 등의 사이트 정보와 플러그인들을 관리할 뿐이다.

- components
  이 폴더는 사이트를 구성하는 내용들을 어떻게 보여줄 것인지에 대한 정보를 담고 있다.
  
1. `layout.js`는 페이지의 레이아웃을 담당하는 <Layout> 컴포넌트를 만든다.
```javascript
import * as React from 'react'
import {Link, useStaticQuery, graphql} from 'gatsby'
import {
  container,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
} from './layout.module.css'

const Layout=({pageTitle, children})=>{
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }  
  `)

  return (
    <main className={container}>
      <title>{pageTitle} | {data.site.siteMetadata.title}</title>
      <p className={siteTitle}>{data.site.siteMetadata.title}</p>
      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link to="/" className={navLinkText}>
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/about" className={navLinkText}>
              About
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/blog-post" className={navLinkText}>
              Blog
            </Link>
          </li>
        </ul>
      </nav>
      <h1 className={heading}>{pageTitle}</h1>
      {children}
    </main>
  )
}

export default Layout
```

2. `layout.module.css`는 `layout.js`의 css 디자인을 만들어 주는 css 모듈이다.

```css
.container{
    margin:auto;
    max-width: 500px;
    font-family: sans-serif;
}

.heading{
    color:rebeccapurple;
}

.nav-links{
    display:flex;
    list-style: none;
    padding-left: 0;
}

.nav-link-item{
    padding-right: 2rem;
}

.nav-link-text{
    color:black;
}

.site-title{
    font-size:3rem;
    color:gray;
    font-weight: 700;
}
```

- images
  페이지에 쓰일 이미지들을 담는 폴더이다.
  
- pages
1. `404.js`
   만약 내가 찾는 주소의 페이지가 존재하지 않을 경우에 나오는 페이지이다.
   디폴트로 만들어 주는 페이지에서 변한 것이 없다.
   
2. `about.js`
간단한 인삿말을 써 놓은 페이지이다. 추후에 나에 대한 정보가 들어갈 예정이다.
```javascript
import * as React from 'react'
import { Link } from 'gatsby'

const AboutPage = () => {
  return (
    <main>
      <title>About Me</title>
      <h1>About Me</h1>
      <Link to="/">Back to Home</Link>
      <p>Hi there! I'm the proud creator of this site, which I built with Gatsby.</p>
    </main>
  )
}

export default AboutPage
```

3. `blog-post.js`
   블로그 글의 레이아웃을 담는다. 현재는 모든 .mdx 파일의 이름을 graphQL로 파싱해서
   레이아웃 내에서 보여주는 역할을 한다.
   
```javascript
import * as React from 'react'
import {graphql} from 'gatsby'
import Layout from '../components/layout'

const BlogPageTemplate=({data})=>{
  return(
    <Layout pageTitle="My Blog Posts">
      <ul>
        {
          data.allFile.nodes.map(node=>(
            <li key={node.name}>
              {node.name}
            </li>
          ))
        }
      </ul>
    </Layout>
  )
}

export const query=graphql`
    query{
        allFile{
            nodes{
                name
            }
        }
    }
`

export default BlogPageTemplate
```

4. `index.js`
   홈페이지에 처음 들어가면 나오는 페이지 파일이다. 웬만한 작업은 모두 `Layout` 컴포넌트에서
   처리해 주므로 간단한 메시지와 테스트용 사진 파일(튜토리얼에서는 개 사진을 사용하였다)을 보여주는 게 전부이다.
   
```javascript
import * as React from 'react'
import Layout from "../components/layout"
import {StaticImage} from "gatsby-plugin-image";

const IndexPage=()=>{
    return(
      <Layout pageTitle="Home Page">
        <p>I'm making this by following the Gatsby Tutorial.</p>
          <StaticImage
              alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
              src="../images/dog.jpg"
          />
      </Layout>
    )
}

export default IndexPage
```