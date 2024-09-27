import AllPostTagList from '@/components/allPostTagList';

import * as styles from './styles.css';

function AllPostTagFilter({ selectedTag }: {selectedTag: string}) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>태그</h2>
      <AllPostTagList selectedTag={selectedTag} />
    </section>
  );
}

export default AllPostTagFilter;