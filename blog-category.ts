interface Category{
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  {title:'CS', url:'/posts/cs'},
  {title:'개발', url:'/posts/dev'},
  {title:'기타', url:'/posts/misc'},
  {title:'소개', url:'/about'},
];

export default blogCategoryList;