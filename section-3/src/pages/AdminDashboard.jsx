import { useCallback, useEffect, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import { ErrorMessage, LoadingMessage } from '../components/Feedback.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/mockApi.js';

const emptyProjectForm = { name: '', description: '' };
const emptyTaskForm = { title: '', description: '', projectId: '', assignedTo: '' };

export default function AdminDashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectData, taskData, employeeData] = await Promise.all([
        api.getProjects(token),
        api.getTasks(token),
        api.getEmployees(token),
      ]);
      setProjects(projectData.projects);
      setTasks(taskData.tasks);
      setEmployees(employeeData.employees);
    } catch (requestError) {
      setError(requestError.message || 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleCreateProject(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const project = await api.createProject(token, projectForm);
      setProjects((current) => [...current, project]);
      setProjectForm(emptyProjectForm);
      setTaskForm((current) => ({ ...current, projectId: current.projectId || String(project.id) }));
    } catch (requestError) {
      setError(requestError.message || 'สร้าง Project ไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const task = await api.createTask(token, taskForm);
      setTasks((current) => [...current, task]);
      setTaskForm((current) => ({ ...emptyTaskForm, projectId: current.projectId }));
    } catch (requestError) {
      setError(requestError.message || 'สร้าง Task ไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(task, status) {
    setSaving(true);
    setError('');
    try {
      const updatedTask = await api.updateStatus(token, task.id, status);
      setTasks((current) =>
        current.map((currentTask) => currentTask.id === updatedTask.id ? updatedTask : currentTask)
      );
    } catch (requestError) {
      setError(requestError.message || 'เปลี่ยนสถานะไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Admin Dashboard">
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="space-y-8">
          <section className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={handleCreateProject} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">สร้าง Project</h2>
              <input className="input-field" placeholder="ชื่อ Project" required value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} />
              <textarea className="input-field min-h-20" placeholder="รายละเอียด" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} />
              <button className="button-primary" disabled={saving}>สร้าง Project</button>
            </form>

            <form onSubmit={handleCreateTask} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold">สร้างและมอบหมาย Task</h2>
              <input className="input-field" placeholder="ชื่อ Task" required value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} />
              <textarea className="input-field min-h-20" placeholder="รายละเอียด" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} />
              <select className="input-field" required value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })}>
                <option value="">เลือก Project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
              <select className="input-field" required value={taskForm.assignedTo} onChange={(event) => setTaskForm({ ...taskForm, assignedTo: event.target.value })}>
                <option value="">เลือก Employee</option>
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
              </select>
              <button className="button-primary" disabled={saving || projects.length === 0}>สร้าง Task</button>
            </form>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">รายการ Task ทั้งหมด</h2>
            <ul className="space-y-3">
              {tasks.map((task) => {
                const project = projects.find((item) => item.id === task.projectId);
                const employee = employees.find((item) => item.id === task.assignedTo);
                return (
                  <li key={task.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{project?.name} · มอบหมายให้ {employee?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={task.status} />
                      <button className="button-secondary" disabled={saving} onClick={() => handleStatusChange(task, task.status === 'Done' ? 'To Do' : 'Done')}>
                        เปลี่ยนเป็น {task.status === 'Done' ? 'To Do' : 'Done'}
                      </button>
                    </div>
                  </li>
                );
              })}
              {tasks.length === 0 && <li className="text-sm text-slate-500">ยังไม่มี Task</li>}
            </ul>
          </section>
        </div>
      )}
    </AppShell>
  );
}
