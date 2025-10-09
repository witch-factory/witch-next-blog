export type ThumbnailType = {
  local: string,
  cloud: string,
  blurURL?: string,
};

export type PostIntroType = {
  title: string,
  description: string,
  thumbnail?: ThumbnailType,
  date: string,
  tags?: string[],
  url: string,
};

export type TocEntry = {
  title: string,
  url: string,
  items: TocEntry[],
};
