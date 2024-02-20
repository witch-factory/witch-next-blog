import { Metadata } from 'next';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import ViewReporter from '@/components/viewReporter';
import generateRssFeed from '@/utils/generateRSSFeed';
import blogCategoryList from 'blog-category';
import { SEOConfig } from 'blog-config';

import { Providers } from './Provider';

import '@/styles/reset.css';
import '@/styles/global.css';
import '@/styles/theme.css';

export const totalViewSlug = 'witch-blog:total-views';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  await generateRssFeed();

  return (
    <html lang='en' style={{ colorScheme:'dark' }} suppressHydrationWarning>
      <body>
        <Providers>
          <ViewReporter slug={totalViewSlug} />
          <Header navList={blogCategoryList} />
          {children}
          <Footer />
          <GoogleAnalytics />
        </Providers> 
      </body>
    </html>
  );
}

export const metadata: Metadata = SEOConfig;