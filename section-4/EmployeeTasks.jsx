import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function EmployeeTasks() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingTaskId, setSavingTaskId] = useState(null);
  const latestRequest = useRef(0);
  const mutationVersion = useRef(0);

  const loadTasks = useCallback(async (showLoading = false) => {
    const requestId = ++latestRequest.current;
    const versionAtStart = mutationVersion.current;
    if (showLoading) setLoading(true);

    try {
      const data = await api.getTasks(token);
      if (
        requestId === latestRequest.current &&
        versionAtStart === mutationVersion.current
      ) {
        setTasks(data.tasks);
        setError('');
      }
    } catch (requestError) {
      if (requestId === latestRequest.current) {
        setError(requestError.message || 'โหลดรายการ Task ไม่สำเร็จ');
      }
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    loadTasks(true);
    const intervalId = window.setInterval(() => loadTasks(), 10000);
    return () => {
      window.clearInterval(intervalId);
      latestRequest.current += 1;
    };
  }, [loadTasks]);

  const markDone = async (task) => {
    setSavingTaskId(task.id);
    setError('');
    try {
      const updatedTask = await api.updateStatus(token, task.id, 'Done');
      mutationVersion.current += 1;
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask
        )
      );
    } catch (requestError) {
      setError(requestError.message || 'อัปเดตไม่สำเร็จ');
    } finally {
      setSavingTaskId(null);
    }
  };

  const visibleTasks = tasks.filter(
    (task) => task.assigned_to === user.id && (filter === 'All' || task.status === filter)
  );

  return (
    <div className="page">
      <select value={filter} onChange={(event) => setFilter(event.target.value)}>
        <option>All</option>
        <option>To Do</option>
        <option>Done</option>
      </select>

      {loading && <p>กำลังโหลด...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>
            {task.title} — {task.status}
            {task.status === 'To Do' && (
              <button
                disabled={savingTaskId === task.id}
                onClick={() => markDone(task)}
              >
                {savingTaskId === task.id ? 'กำลังบันทึก...' : 'เปลี่ยนเป็น Done'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
