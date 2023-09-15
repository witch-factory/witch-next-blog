interface Category{
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  { title:'글목록', url:'/posts/all' },
  { title:'소개', url:'/about' },
];

export default blogCategoryList;