import Link from 'next/link';

interface PropsItem{
  title: string;
  url: string;
}

function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header>
      <nav>
        {
          navList.map((item) => {
            return <button key={item.title}>
              <Link href={item.url} aria-label={item.title}>
                {item.title}
              </Link>
            </button>;
          })
        }
      </nav>
    </header>
  );
}

export default Header;