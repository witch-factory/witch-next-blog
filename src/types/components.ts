export type ProfileLinkType={
  siteName: string;
  siteLink: string;
};

export type TagListType={
  tags: string[];
};

export type ThumbnailType={
  local: string;
  cloud?: string;
  blurURL?: string;
};

export type PostIntroType = {
  title: string;
  description: string;
  thumbnail?: ThumbnailType;
  date: string;
  tags: string[];
  url: string;
};

export type TocEntry = {
  title: string;
  url: string;
  items: TocEntry[];
};

export type FrontMatterType={
  title: string;
  date: string;
  tags: string[];
  view?: number;
};

export type PaginationType = {
  totalItemNumber: number;
  currentPage: number;
  renderPageLink: (page: number) => string;
  perPage: number;
};