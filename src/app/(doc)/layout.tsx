import PageContainer from '@/components/templates/pageContainer';

function DocLayout({ children }: {children: React.ReactNode}) {
  return (
    <PageContainer pageType='post'>
      {children}
    </PageContainer>
  );
}

export default DocLayout;