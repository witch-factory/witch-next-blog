import { Metadata } from 'next';

import { Providers } from './Provider';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageContainer from '@/components/pageContainer';
import ViewReporter from '@/components/viewReporter';
import { blogCategoryList } from '@/config/blogCategory';
import { SEOConfig } from '@/config/blogConfig';
import Footer from '@/ui/footer';
import Header from '@/ui/header';


import '@/styles/reset.css';
import '@/styles/global.css';
import '@/styles/theme.css';

const totalViewSlug = 'witch-blog:total-views';

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' style={{ colorScheme:'dark' }} suppressHydrationWarning>
      <body>
        <Providers>
          <ViewReporter slug={totalViewSlug} />
          <Header blogCategoryList={blogCategoryList} />
          <PageContainer>
            {children}
          </PageContainer>
          <Footer />
          <GoogleAnalytics />
        </Providers> 
      </body>
    </html>
  );
}

export const metadata: Metadata = SEOConfig;