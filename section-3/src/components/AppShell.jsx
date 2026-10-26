import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppShell({ title, children }) {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-bold tracking-tight text-indigo-700">
            Project Access
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              {user?.name} · {user?.role}
            </span>
            <button className="button-secondary" onClick={logout}>ออกจากระบบ</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {children}
      </section>
    </main>
  );
}
