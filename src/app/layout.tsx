import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import PageContainer from '@/components/templates/pageContainer';
import generateRssFeed from '@/utils/generateRSSFeed';
import blogCategoryList from 'blog-category';

import Provider from './Provider';

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
    <html lang='en' style={{ colorScheme:'light' }}>
      <body>
        <Provider>
          <Header navList={blogCategoryList} />
          <PageContainer>
            {children}
          </PageContainer>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}