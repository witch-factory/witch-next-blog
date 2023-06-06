import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function registerViewCount(slug) {
  await supabase
    .from('views')
    .insert({slug, view_count:1});
}

async function getViewCount(slug) {
  const {data, error}=await supabase
    .from('views')
    .select('view_count')
    .eq('slug', slug)
    .single();

  return {data, error};
}

// slug를 받아서 해당 slug row의 view_count 반환
export async function fetchViewCount(slug) {
  const {data, error}=await getViewCount(slug);
  
  // 만약 slug와 같은 제목을 가진 row가 없다면 추가한 후 다시 getViewCount
  if (error) {
    if (error.details.includes('0 rows')) {
      /* 새로운 row 삽입 */
      await registerViewCount(slug);
      const {data:newData, error:newError}=await getViewCount(slug);
      if (newError) {
        /* 그래도 에러 발생 */
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

export async function updateViewCount(slug) {
  await supabase.rpc('increment', {slug_text:slug});
}