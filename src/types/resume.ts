export type ResumeLink = {
  text: string,
  url: string,
};

export type ResumeContact = { label: string } & ResumeLink;

export type ResumeItem = {
  type: 'string',
  content: string,
} | {
  type: 'link',
  content: ResumeLink,
} | {
  type: 'note-link',
  content: string,
  note: ResumeLink,
};

export type ResumeDetail = {
  title?: string,
  period?: string,
  items: ResumeItem[],
};

export type ResumeEntry = {
  title: string,
  description?: string,
  tech?: string,
  period?: string,
  role?: string,
  links?: ResumeLink[],
  details: ResumeDetail[],
};

export type ResumeLabels = Partial<Record<keyof ResumeContent, string>>;

export type ResumeContent = {
  labels: ResumeLabels,
  name: string,
  tagline: string,
  contact: ResumeContact[],
  summary: string,
  career: ResumeEntry[],
  project: ResumeEntry[],
  presentation: ResumeEntry[],
  education: ResumeDetail[],
  activity: ResumeDetail[],
};
