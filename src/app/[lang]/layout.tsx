import GoogleAnalytics from '@/components/GoogleAnalytics';
import LanguageSwitcher from '@/components/langSwitch';
import PageContainer from '@/components/pageContainer';
import ViewReporter from '@/components/viewReporter';
import { blogCategory } from '@/config/blogCategory';
import { blogMetadata } from '@/config/blogMetadata';
import { Locale, i18n } from '@/types/i18n';
import Footer from '@/ui/footer';
import Header from '@/ui/header';

import { Providers } from './Provider';

import '@/styles/reset.css';
import '@/styles/theme.css';
import '@/styles/github-light.css';
import '@/styles/github-dark.css';
import '@/styles/panda-syntax-light.css';
import '@/styles/panda-syntax-dark.css';

const totalViewSlug = 'witch-blog:total-views';

type Props = {
  params: { lang: Locale },
  children: React.ReactNode,
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  params,
  children,
}: Props) {
  return (
    <html lang={params.lang} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body>
        <Providers>
          <ViewReporter slug={totalViewSlug} />
          <Header
            lang={params.lang}
            blogCategoryList={blogCategory[params.lang]}
          />
          <PageContainer>
            <LanguageSwitcher lang={params.lang} />
            {children}
          </PageContainer>
          <Footer lang={params.lang} />
          <GoogleAnalytics />
        </Providers>
      </body>
    </html>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}

export function generateMetadata({ params: { lang } }: Props) {
  return blogMetadata[lang];
}
