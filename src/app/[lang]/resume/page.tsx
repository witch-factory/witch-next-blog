import { Fragment } from 'react';

import Flex from '@/containers/flex';
import List from '@/containers/list';
import { Locale } from '@/types/i18n';
import Text from '@/ui/text';

import { ResumeGroup, ResumeDetail, ResumeSection } from './components';
import { enResumeContent } from './content/en';
import { koResumeContent } from './content/ko';
import * as styles from './resume-style.css';
import { title } from './resume-style.css';

type Props = {
  params: Promise<{
    lang: Locale,
  }>,
};

async function Resume({ params }: Props) {
  const { lang } = await params;

  const resumeContent = lang === 'ko' ? koResumeContent : enResumeContent;

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={title({ size: 'xl' })}>{resumeContent.name}</h1>
          <Text>{resumeContent.tagline}</Text>
        </div>
        <List direction="column" gap="xs" listStyle="none">
          {resumeContent.contact.map((contact) => (
            <List.Item key={contact.label}>
              {contact.label}
              :&nbsp;
              <a href={contact.url} target="_blank" rel="noopener noreferrer">
                {contact.text}
              </a>
            </List.Item>
          ))}
        </List>
      </header>
      <Flex direction="column" gap="xl">
        <ResumeGroup title={resumeContent.labels.summary ?? 'Summary'}>
          <Text>
            {resumeContent.summary}
          </Text>
        </ResumeGroup>
        <ResumeGroup title={resumeContent.labels.career ?? 'Experience'}>
          {resumeContent.career.map((entry) => (
            <ResumeSection
              key={entry.title}
              title={entry.title}
              description={entry.description}
              tech={entry.tech}
              period={entry.period}
              role={entry.role}
              links={entry.links?.map((link) => (
                <a
                  key={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link.url}
                  className={title({ size: 'md', weight: 'normal' })}
                >
                  {link.text}
                </a>
              ))}
            >
              {entry.details.map((detail) => (
                <ResumeDetail key={detail.title} title={detail.title} items={detail.items} />
              ))}
            </ResumeSection>
          ))}
        </ResumeGroup>
        <ResumeGroup title={resumeContent.labels.project ?? 'Projects'}>
          {resumeContent.project.map((entry, index) => (
            <Fragment key={entry.title}>
              {' '}
              <ResumeSection
                key={entry.title}
                title={entry.title}
                description={entry.description}
                tech={entry.tech}
                period={entry.period}
                role={entry.role}
                links={entry.links?.map((link) => (
                  <a
                    key={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.url}
                    className={title({ size: 'md', weight: 'normal' })}
                  >
                    {link.text}
                  </a>
                ))}
              >
                {entry.details.map((detail) => (
                  <ResumeDetail key={detail.title} title={detail.title} items={detail.items} />
                ))}
              </ResumeSection>
              {(index < resumeContent.project.length - 1) && (
                <hr className={styles.separator} />)}
            </Fragment>
          ))}

        </ResumeGroup>

        <ResumeGroup title={resumeContent.labels.presentation ?? 'Talks'}>
          {resumeContent.presentation.map((entry) => (
            <ResumeSection
              key={entry.title}
              title={entry.title}
              description={entry.description}
              tech={entry.tech}
              period={entry.period}
              role={entry.role}
              links={entry.links?.map((link) => (
                <a
                  key={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link.url}
                  className={title({ size: 'md', weight: 'normal' })}
                >
                  {link.text}
                </a>
              ))}
            >
              {entry.details.map((detail, index) => (
                <ResumeDetail key={index} title={detail.title} items={detail.items} />
              ))}
            </ResumeSection>
          ))}
        </ResumeGroup>
        <ResumeGroup title={resumeContent.labels.education ?? 'Education'}>
          {resumeContent.education.map((entry, index) => (
            <ResumeDetail key={index} title={entry.title} period={entry.period} items={entry.items} />
          ))}
        </ResumeGroup>
        <ResumeGroup title={resumeContent.labels.activity ?? 'Activities'}>
          {resumeContent.activity.map((entry, index) => (
            <ResumeDetail key={index} title={entry.title} period={entry.period} items={entry.items} />
          ))}
        </ResumeGroup>
      </Flex>
    </>
  );
}

export default Resume;
