import { list, type ListVariants } from './styles.css';

type ListProps = {
  children: React.ReactNode,
} & ListVariants;

function List({
  children,
  ...props
}: ListProps) {
  return (
    <ul className={list(props)}>
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
