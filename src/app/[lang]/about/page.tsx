import Image from 'next/image';
import Link from 'next/link';

import { i18n, Locale } from '@/types/i18n';

import { aboutContent } from './content';
import * as styles from './styles.css';

type Props = {
  params: { lang: Locale },
};

function AboutPage({ params }: Props) {
  const { lang } = params;

  return (
    <div className={styles.container}>
      <h2 className={styles.marginBottom}>{aboutContent[lang].name}</h2>
      <p>
        {aboutContent[lang].description}
      </p>
      <section>
        <div className={styles.introBox}>
          <div className={styles.mobileHidden}>
            <Image
              width={120}
              height={120}
              style={{ margin: '0 auto' }}
              src="/witch-new-hat.png"
              alt={aboutContent[lang].symbolInfo}
            />
            <p>{aboutContent[lang].symbolInfo}</p>
          </div>
          <ul>
            {aboutContent[lang].links.map((link) => (
              <li key={link.name}>
                <a target="_blank" href={link.url}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <h2>{aboutContent[lang].introduction.title}</h2>
        {aboutContent[lang].introduction.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section>
        <h2>{aboutContent[lang].interests.title}</h2>
        <section>
          <h3>{aboutContent[lang].interests.algorithms.title}</h3>
          <ul>
            {aboutContent[lang].interests.algorithms.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {aboutContent[lang].interests.algorithms.accounts.map((account) => (
              <li key={account.name}>
                {account.name}
                :
                {' '}
                <a target="_blank" href={account.url}>
                  {account.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>{aboutContent[lang].interests.javascript.title}</h3>
          <ul>
            {aboutContent[lang].interests.javascript.items.map((item) => (
              <li key={item.name}>
                <Link href={item.url} target="_blank">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}

export default AboutPage;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}
