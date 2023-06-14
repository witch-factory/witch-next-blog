import Category, {CategoryProps} from './category';

function CategoryList({categoryPostList}: {categoryPostList: CategoryProps[]}) {
  return (
    <article>
      {/* 카테고리별 글 목록을 만들기 */}
      {categoryPostList.map((category: CategoryProps) => {
        return category.items.length?
          <Category
            key={category.url}
            {...category}
          />:null;
      })
      }
    </article>
  );
}


export default CategoryList;