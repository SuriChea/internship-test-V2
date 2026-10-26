import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorMessage } from '../components/Feedback.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const signedInUser = await login(username.trim(), password);
      navigate(signedInUser.role === 'admin' ? '/admin' : '/employee', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-indigo-700">PROJECT ACCESS CONTROL</p>
          <h1 className="mt-2 text-2xl font-bold">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-sm text-slate-500">ใช้บัญชีทดสอบเพื่อเข้าใช้งานระบบ</p>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        <label className="block text-sm font-medium">
          Username
          <input className="input-field mt-1" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input className="input-field mt-1" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="button-primary w-full" disabled={loading}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <div className="space-y-1 text-xs text-slate-500">
          <p>Admin: admin / admin123</p>
          <p>Employee: employee1 หรือ employee2 / employee123</p>
        </div>
      </form>
    </main>
  );
}
