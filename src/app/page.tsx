import Profile from '@/components/organisms/profile';
import RecentPosts from '@/components/organisms/recentPosts';
import { getRecentPosts } from '@/utils/post';

// cache revalidate in 1 day
export const revalidate = 24 * 60 * 60;

async function Home() {
  const recentPosts = getRecentPosts();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      {/* <ViewCounter view={totalViews} /> */}
      <RecentPosts title='최근에 작성한 글' url='/posts/all' items={recentPosts} />
    </>
  );
}

export default Home;