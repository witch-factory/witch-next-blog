import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

import Footer from '@/components/footer';
import Header from '@/components/header';
import blogCategoryList from 'blog-category';
import { SEOConfig } from 'blog-config';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEOConfig} />
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
