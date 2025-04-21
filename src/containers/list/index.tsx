import { pickProps } from '@/utils/pickProps';

import { list, type ListVariants } from './styles.css';

type ListProps = {
  children: React.ReactNode,
} & ListVariants;

function List({
  children,
  ...props
}: ListProps) {
  const listProps = pickProps(props, ['direction', 'gap', 'wrap', 'listStyle']);

  return (
    <ul className={list(listProps)}>
      {children}
    </ul>
  );
}

type ListItemProps = {
  children: React.ReactNode,
  className?: string,
};

function Item({ children, className }: ListItemProps) {
  return <li className={className}>{children}</li>;
}

List.Item = Item;

export default List;
