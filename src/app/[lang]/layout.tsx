import GoogleAnalytics from '@/components/GoogleAnalytics';
import LanguageSwitcher from '@/components/langSwitch';
import PageContainer from '@/components/pageContainer';
import ViewReporter from '@/components/viewReporter';
import { blogCategory } from '@/config/blogCategory';
import { SEOConfig } from '@/config/blogConfig';
import { Language, locales } from '@/types/i18n';
import Footer from '@/ui/footer';
import Header from '@/ui/header';

import { Providers } from './Provider';

import '@/styles/reset.css';
import '@/styles/global.css';
import '@/styles/theme.css';

const totalViewSlug = 'witch-blog:total-views';

type Props = {
  params: { lang: Language },
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
          <LanguageSwitcher lang={params.lang} />
          <PageContainer>{children}</PageContainer>
          <Footer lang={params.lang} />
          <GoogleAnalytics />
        </Providers>
      </body>
    </html>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

export function generateMetadata({ params: { lang } }: Props) {
  return SEOConfig[lang];
}
