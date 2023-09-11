import PageContainer from '@/components/templates/pageContainer';

function PageLayout({ children }: {children: React.ReactNode}) {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
}

export default PageLayout;