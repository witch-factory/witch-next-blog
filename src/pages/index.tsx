import {
  GetStaticProps,
  InferGetStaticPropsType
} from 'next';

import CategoryList from '@/components/categoryList';
import {CategoryProps} from '@/components/categoryList/category';
import PageContainer from '@/components/pageContainer';
import Profile from '@/components/profile';
import ProjectList from '@/components/projectList';
import generateRssFeed from '@/utils/generateRSSFeed';
import { getAllPostTags, getPostsByTag } from '@/utils/post';
import { DocumentTypes } from 'contentlayer/generated';

import { ITEMS_PER_PAGE } from './posts/tag/[tag]/[page]';

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
      <ProjectList />
      <CategoryList categoryPostList={categoryPostList} />
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await generateRssFeed();

  const AllPostTags=getAllPostTags();

  const categoryPostList: CategoryProps[]=AllPostTags.map((tag)=>{
    const title=tag;
    const url=`/posts/tag/${tag}`;
    return {
      title,
      url,
      items: getPostsByTag(
        {tag, currentPage:1, postsPerPage:ITEMS_PER_PAGE}
      ).pagePosts.slice(0, 3).map((post: DocumentTypes)=>{
        return propsProperty(post);
      }),
    };
  });

  return { props: { categoryPostList } };
};
