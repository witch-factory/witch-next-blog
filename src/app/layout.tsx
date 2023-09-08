import Header from '@/components/organisms/header';
import blogCategoryList from 'blog-category';

import Provider from './Provider';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Provider>
          <Header navList={blogCategoryList} />
          {children}
        </Provider>
      </body>
    </html>
  );
}