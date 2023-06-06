import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function registerView(slug) {
  await supabase
    .from('views')
    .insert({slug, view_count:1});
}

// slug를 받아서 해당 slug row의 view_count 반환
export async function getViewCount(slug) {
  const {data, error}=await supabase.from('views').select('view_count').eq('slug', slug).single();
  
  // 만약 slug와 같은 제목을 가진 row가 없다면 data가 null이 될 것이다.
  if (error) {
    if (error.details.includes('0 rows')) {
      /* 새로운 row 삽입 */
      await registerView(slug);
      const {data:newData, error:newError}=await getViewCount(slug);
      if (newError) {
        /* 그래도 에러 발생.. */
        return {data:null, error:newError};
      }
      else {
        return {data:newData, error:null};
      }
    }
    else {
      /* 0 row가 아닌 에러 발생 */
      return {data:null, error};
    }
  }
  return {data, error};
}