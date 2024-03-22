export type ProfileLinkType={
  siteName: string;
  siteLink: string;
};

export type TagListType={
  tags: string[];
};

export interface PostIntroType{
  title: string;
  description: string;
  thumbnail?: {
    local: string;
    cloudinary?: string;
    blurURL?: string;
  }
  date: string;
  tags: string[];
  url: string;
}

export type TocEntry = {
  title: string;
  url: string;
  items: TocEntry[];
};