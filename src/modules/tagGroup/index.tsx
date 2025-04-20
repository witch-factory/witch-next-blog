import Link from 'next/link';

import { Tag } from '#site/content';
import Flex from '@/containers/flex';
import List from '@/containers/list';
import Badge from '@/ui/badge';
import Heading from '@/ui/heading';
import Text from '@/ui/text';

type Props = {
  title: string,
  selectedTagSlug: string,
  tags: Tag[],
};

function TagGroup({ title, selectedTagSlug, tags }: Props) {
  return (
    <Flex direction="column" gap="lg">
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <List direction="row" gap="sm" wrap="wrap">
        {tags.map((tag) => (
          <List.Item key={tag.slug}>
            <Badge as={Link} href={tag.url} size="md" radius="full" hover="background" color={tag.slug === selectedTagSlug ? 'accent' : 'normal'}>
              {tag.name}
              &nbsp;
              <Text as="span" size="sm" color="info">
                {`(${tag.count})`}
              </Text>
            </Badge>
          </List.Item>
        ))}
      </List>
    </Flex>
  );
}

export default TagGroup;
