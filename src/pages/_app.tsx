import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Footer from '@/components/footer';
import Header from '@/components/header';
import blogCategoryList from 'blog-category';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header navList={blogCategoryList} />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
