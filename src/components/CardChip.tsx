export function CardChip({ text, small }: { text: string; small?: boolean }) {
  return <div className={`card-chip${small ? ' card-chip--small' : ''}`}>{text}</div>;
}
