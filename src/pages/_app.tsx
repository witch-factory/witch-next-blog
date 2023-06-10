import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

import Footer from '@/components/footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Header from '@/components/header';
import * as ga from '@/lib/ga';
import blogCategoryList from 'blog-category';
import { SEOConfig } from 'blog-config';


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <DefaultSeo {...SEOConfig} />
      {/* attribute가  테마에 따라 value로 바뀐다.*/}
      <ThemeProvider
        defaultTheme='system'
        enableSystem={true}
        value={{ dark: 'dark', light: 'light' }}
      >
        <Header navList={blogCategoryList} />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
      <GoogleAnalytics />
    </>
  );
}
