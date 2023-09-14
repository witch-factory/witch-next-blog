import GoogleAnalytics from '@/components/GoogleAnalytics';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import generateRssFeed from '@/utils/generateRSSFeed';
import blogCategoryList from 'blog-category';

import { Providers } from './Provider';

import '@/styles/globals.css';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  await generateRssFeed();

  return (
    <html lang='en' style={{ colorScheme:'system' }} suppressHydrationWarning>
      <body>
        <Providers>
          <Header navList={blogCategoryList} />
          {children}
          <Footer />
          <GoogleAnalytics />
        </Providers> 
      </body>
    </html>
  );
}