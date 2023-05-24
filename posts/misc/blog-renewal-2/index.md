---
title: 블로그 리뉴얼 - 2.페이지 동적 생성
date: "2021-06-29T00:00:00Z"
description: "블로그 리뉴얼 - 페이지 동적 생성"
tags: ["blog", "web"]
---

### 1. 블로그 글 페이지의 동적 생성 필요성
현재 블로그의 제목들을 graphQL로 파싱하여 URL/blog 페이지에 보여주고 있다.
그런데 이렇게 블로그 제목만 보여주는 것은 아무런 쓸모가 없다.

블로그에 올라온 글들의 제목이 나열되어 있고, 보고 싶은 블로그 글의 제목을 누르면 
그 글을 보여주는 페이지로 리다이렉트되는 부분을 구현해야 비로소 블로그 메뉴가 의미를 가질 것이다.

따라서 블로그 글마다 페이지를 동적 생성하는 코드를 구현하기로 한다.
페이지의 동적 생성을 위해서 gatsby에서는 `gatsby-node` 라는 API를 지원한다.
[gatsby node APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/)

이는 gatsby 블로그를 구성하는 파일 디렉토리의 최상단에 `gatsby-node.js`파일을
만들고 적절한 코드를 짜는 것으로 이용할 수 있다.

### 2. gatsby 페이지 동적 생성

다행히 내가 원래 사용하던 `gatsby-startet-blog` 스타터에 잘 구현된 파일이 있어서
그걸 조금 고쳐서 사용하기로 한다.

[gatsby-starter-blog gatsby-node.js](https://github.com/gatsbyjs/gatsby-starter-blog/blob/master/gatsby-node.js)

아주 잘 만들어진 코드이기 때문에 거의 그대로 가져다 써도 된다.
단 몇 가지의 수정사항이 있다.

첫번째로, gatsby blog tutorial은 그냥 마크다운 파일이 아니라 .mdx 파일을 사용한다는 것이다.
다행히 `gatsby-node.js` 파일을 mdx에 맞게 고치는 데에 대한 안내 글이
공식 사이트에 존재한다. 이를 따라하면 몇 줄만의 수정으로 .mdx 파일들에 대해서도
동적인 페이지 생성이 가능하도록 할 수 있다.

[Migrating Remark to MDX](https://www.gatsbyjs.com/docs/how-to/routing/migrate-remark-to-mdx/)

주의할 점은 gatsby 공식 튜토리얼과 달리 이 파일은 `.mdx` 파일의 제목으로 파일을 구분하지 않는다는 것이다.
우리가 가져온 `gatsby-node.js` 파일은 `/blog` 에 있는 폴더들의 이름으로 페이지를 생성한다.
따라서 앞으로 블로그에 글을 쓸 때는 페이지를 생성하고 싶은 문장으로 폴더명을 만든 다음
그 폴더 내에 .md 혹은 .mdx파일을 써야 한다.

글에 넣을 사진이나 다른 파일들을 분류할 수 있다는 점에서, 단일 mdx파일이 아니라
폴더별로 글을 관리할 수 있다는 건 오히려 좋은 일이다.

또한 우리는 gatsby 튜토리얼에서 `/blog` 페이지를 따로 만들었었고, 거기를 통해서
블로그 글에 접근하도록 만들 것이다. 따라서 페이지를 만들 때 `/blog/글 제목`으로
만들어지도록 해야 할 것이다. 따라서 `createPage` 함수에서 path를 적당히 바꿔 준다.
원래는 단순히 `post.slug` 였는데 이를 `blog/${post.slug}`로 바꿔준다.

완성된 `gatsby-node.js`는 다음과 같다.

```javascript
const path=require(`path`)
const {createFilePath}=require(`gatsby-source-filesystem`)

exports.createPages=async({graphql, actions, reporter})=>{
  const {createPage}=actions

  const blogPost=path.resolve(`./src/templates/blog-post.js`)

  const result=await graphql(
  `
    {
      allMdx(sort: {fields: frontmatter___date, order: ASC}, limit: 1000) {
        nodes {
          id
          slug
        }
      }
    }
  `
  )

  if(result.errors){
    reporter.panicOnBuild(
      `Error occured when loading your blog posts`,
      result.errors
    )
    return
  }

  const posts=result.data.allMdx.nodes

  if(posts.length>0){
    posts.forEach((post,index)=>{
      const prevPostId=index===0?null:posts[index-1].id
      const nextPostId=index===posts.length-1?null:posts[index+1].id

      createPage({
        path:`blog/${post.slug}` || '',
        component:blogPost,
        context:{
          id:post.id,
          prevPostId,
          nextPostId,
        },
      })
    })
  }
}


exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}


exports.createSchemaCustomization = ({ actions }) => {
  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.ts

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  actions.createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      thumbnail: String
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type Mdx implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};
```

