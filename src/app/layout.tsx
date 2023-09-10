import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import PageContainer from '@/components/templates/pageContainer';
import blogCategoryList from 'blog-category';

import Provider from './Provider';

import '@/styles/globals.css';


export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
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