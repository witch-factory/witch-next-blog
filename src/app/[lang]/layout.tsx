import { blogCategory } from '@/config/blogCategory';
import { blogMetadata } from '@/config/blogMetadata';
import Frame from '@/containers/frame';
import GoogleAnalytics from '@/features/googleAnalytics';
import LanguageSwitcher from '@/features/languageSwitch';
import ViewReporter from '@/features/viewReporter';
import Footer from '@/modules/footer';
import Header from '@/modules/header';
import { Locale, i18n } from '@/types/i18n';

import { Providers } from './Provider';

import '@/styles/reset.css';
import '@/styles/theme.css';
import '@/styles/syntax/github-light.css';
import '@/styles/syntax/github-dark.css';
import '@/styles/syntax/panda-syntax-light.css';
import '@/styles/syntax/panda-syntax-dark.css';

const totalViewSlug = 'witch-blog:total-views';

type Props = {
  params: Promise<{ lang: Locale }>,
  children: React.ReactNode,
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  params,
  children,
}: Props) {
  const { lang } = await params;

  return (
    <html lang={lang} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body>
        <Providers>
          <ViewReporter slug={totalViewSlug} />
          <Header
            lang={lang}
            blogCategoryList={blogCategory[lang]}
          />
          <Frame>
            <LanguageSwitcher lang={lang} />
            {children}
          </Frame>
          <Footer lang={lang} />
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

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return blogMetadata[lang];
}
