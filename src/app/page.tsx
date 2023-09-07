import Title from '@/components/atoms/title';
import ThemeChanger from '@/components/molecules/ThemeChanger';

function Home() {
  return (
    <div>
      <Title heading='h1' size='md'>Home</Title>
      <ThemeChanger />
    </div>
  );
}

export default Home;