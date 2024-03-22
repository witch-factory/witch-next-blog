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
  image?: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  }
  date: string;
  tags: string[];
  url: string;
}