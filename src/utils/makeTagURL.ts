export const makeTagURL = (tag: string): string=>{
  if (tag === 'All') {
    return '/posts/all';
  }
  else {
    return `/posts/tag/${tag}`;
  }
};