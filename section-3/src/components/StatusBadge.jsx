export default function StatusBadge({ status }) {
  const colorClass =
    status === 'Done'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-amber-100 text-amber-800';

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>{status}</span>;
}
