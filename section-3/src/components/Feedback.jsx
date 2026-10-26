export function LoadingMessage({ children = 'กำลังโหลดข้อมูล...' }) {
  return <p className="py-5 text-sm text-slate-500" role="status">{children}</p>;
}

export function ErrorMessage({ children }) {
  if (!children) return null;
  return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{children}</p>;
}
