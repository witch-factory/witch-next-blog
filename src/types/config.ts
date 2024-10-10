export type BlogCategoryType={
  title: string;
  url: string;
};

export type BlogConfigType= {
  name: string; // used for footer and RSS feed
  title: string;
  description: string;
  picture: string;
  pictureBlur?: string;
  url: string;
  social: {
    GitHub: string;
    BOJ: string;
  };
  comment: {
      type: 'giscus';
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      lang?: 'ko' | 'en'; // defaults to 'en'
      lazy?: boolean;
    };
  imageStorage: 'local' | 'cloudinary'; // defaults to 'local'
  thumbnail: string;
  googleAnalyticsId?: string; // gtag id
};

export type BlogProjectType = {
  title: string;
  description: string;
  image: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  };
  url: string;
  tags: string[];
};