interface Category{
  title: string;
  url: string;
}

const blogCategoryList: Category[] = [
  {title:'Home', url:'/'},
  {title:'CS', url:'/posts/cs'},
  {title:'Front', url:'/posts/front'},
  {title:'Misc', url:'/posts/misc'},
  {title:'About', url:'/about'},
];

export default blogCategoryList;