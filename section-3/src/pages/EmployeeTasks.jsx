import { useCallback, useEffect, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import { ErrorMessage, LoadingMessage } from '../components/Feedback.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/mockApi.js';

export default function EmployeeTasks() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingTaskId, setSavingTaskId] = useState(null);

  const loadTasks = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api.getTasks(token);
      setTasks(data.tasks);
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'โหลดรายการ Task ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTasks(true);
    const intervalId = window.setInterval(() => loadTasks(), 10000);
    return () => window.clearInterval(intervalId);
  }, [loadTasks]);

  async function markDone(task) {
    setSavingTaskId(task.id);
    setError('');
    try {
      const updatedTask = await api.updateStatus(token, task.id, 'Done');
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask
        )
      );
    } catch (requestError) {
      setError(requestError.message || 'บันทึกสถานะไม่สำเร็จ');
    } finally {
      setSavingTaskId(null);
    }
  }

  const visibleTasks = tasks.filter(
    (task) => task.assignedTo === user.id && (filter === 'All' || task.status === filter)
  );

  return (
    <AppShell title="งานของฉัน">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">แสดงเฉพาะ Task ที่มอบหมายให้คุณ</p>
        <label className="text-sm font-medium">
          กรองสถานะ{' '}
          <select className="input-field inline-block w-auto" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All</option>
            <option>To Do</option>
            <option>Done</option>
          </select>
        </label>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? (
        <LoadingMessage />
      ) : (
        <ul className="mt-4 space-y-3">
          {visibleTasks.map((task) => (
            <li key={task.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="min-w-0">
                <h2 className="font-semibold">{task.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{task.description || 'ไม่มีรายละเอียด'}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} />
                {task.status === 'To Do' && (
                  <button className="button-primary" disabled={savingTaskId === task.id} onClick={() => markDone(task)}>
                    {savingTaskId === task.id ? 'กำลังบันทึก...' : 'เปลี่ยนเป็น Done'}
                  </button>
                )}
              </div>
            </li>
          ))}
          {visibleTasks.length === 0 && (
            <li className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              ไม่พบ Task ในสถานะนี้
            </li>
          )}
        </ul>
      )}
    </AppShell>
  );
}
