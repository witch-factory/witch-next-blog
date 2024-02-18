import { Metadata } from 'next';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import blogCategoryList from 'blog-category';
import { SEOConfig } from 'blog-config';

import { Providers } from './Provider';

import '@/styles/reset.css';
import '@/styles/global.css';
import '@/styles/theme.css';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  // await generateRssFeed();

  return (
    <html lang='en' style={{ colorScheme:'dark' }} suppressHydrationWarning>
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

export const metadata: Metadata = SEOConfig;