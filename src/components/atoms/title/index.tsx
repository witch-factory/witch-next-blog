interface Props {
  heading: 'h1' | 'h2' | 'h3';
  className?: string;
}

function Title({ heading, className, children }: React.PropsWithChildren<Props>) {
  const Heading = heading;
  return (
    <Heading className={className}>
      {children}
    </Heading>
  );
}

export default Title;