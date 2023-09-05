import { toISODate, formatDate } from '@/utils/date';

interface Props {
  date: string;
}

function Timestamp({ date }: Props) {
  const dateObj = new Date(date);
  return (
    <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
  );
}

export default Timestamp;