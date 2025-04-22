import { ResumeDetail as ResumeDetailProps } from '@/types/resume';

import * as styles from './resume-style.css';
import { title } from './resume-style.css';

export function ResumeGroup({ title: groupTitle, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className={styles.group}>
      <h2 className={title({ size: 'accent' })}>{groupTitle}</h2>
      {children}
    </section>
  );
}

export type ResumeSectionProps = {
  title: string,
  description?: string,
  tech?: string,
  period?: string,
  role?: string,
  links?: React.ReactNode,
  children: React.ReactNode,
};

export function ResumeSection({ title: sectionTitle, description, tech, period, role, links, children }: ResumeSectionProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.headerIntro}>
            <h3 className={title({ size: 'lg' })}>{sectionTitle}</h3>
            {links}
          </div>
          {description && <p>{description}</p>}
          {tech && <p className={styles.info}>{tech}</p>}
        </div>
        <div className={styles.headerSub}>
          {period && <p className={styles.period}>{period}</p>}
          {role && <p className={styles.info}>{role}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function DetailHeader({ title: detailTitle, period }: Omit<ResumeDetailProps, 'items'>) {
  if (!detailTitle && !period) {
    return null;
  }
  if (detailTitle && period) {
    return (
      <header className={styles.header}>
        <h4 className={title({ size: 'sm' })}>{detailTitle}</h4>
        <p className={styles.period}>{period}</p>
      </header>
    );
  }
  return <h4 className={title({ size: 'sm' })}>{detailTitle}</h4>;
}

export function ResumeDetail({ title: itemTitle, period, items }: ResumeDetailProps) {
  return (
    <section className={styles.item}>
      <DetailHeader title={itemTitle} period={period} />
      <ul>
        {items.map((item) => {
          switch (item.type) {
            case 'string':
              return <li key={item.content}>{item.content}</li>;

            case 'link':
              return (
                <li key={item.content.text}>
                  <a href={item.content.url} target="_blank" rel="noopener noreferrer">
                    {item.content.text}
                  </a>
                </li>
              );

            case 'note-link':
              return (
                <li key={item.content}>
                  {item.content}
          &nbsp;
                  <a href={item.note.url} target="_blank" rel="noopener noreferrer">
                    {item.note.text}
                  </a>
                </li>
              );
            default:
              return null;
          }
        })}
      </ul>
    </section>
  );
}
