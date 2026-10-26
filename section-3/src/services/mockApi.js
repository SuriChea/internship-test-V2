const wait = (duration = 180) => new Promise((resolve) => setTimeout(resolve, duration));

const users = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Project Admin', role: 'admin' },
  { id: 2, username: 'employee1', password: 'employee123', name: 'Alex Employee', role: 'employee' },
  { id: 3, username: 'employee2', password: 'employee123', name: 'Sam Employee', role: 'employee' },
];

let projects = [
  { id: 1, name: 'Website Refresh', description: 'ปรับปรุงเว็บไซต์บริษัท' },
  { id: 2, name: 'Mobile App', description: 'งานพัฒนาแอปบนมือถือ' },
];

let tasks = [
  { id: 1, projectId: 1, title: 'ออกแบบหน้าแรก', description: 'จัดทำแบบร่างหน้าแรก', assignedTo: 2, status: 'To Do', createdAt: '2026-10-20T09:00:00Z' },
  { id: 2, projectId: 1, title: 'เขียนชุดสี', description: 'กำหนดสีหลักของเว็บไซต์', assignedTo: 3, status: 'Done', createdAt: '2026-10-21T09:00:00Z' },
  { id: 3, projectId: 1, title: 'ตรวจสอบการเข้าถึง', description: 'ตรวจสอบการใช้งานด้วยคีย์บอร์ด', assignedTo: 2, status: 'To Do', createdAt: '2026-10-22T09:00:00Z' },
  { id: 4, projectId: 2, title: 'วางโครงสร้างหน้าจอ', description: 'จัดทำโครงหน้าจอแอป', assignedTo: 3, status: 'To Do', createdAt: '2026-10-23T09:00:00Z' },
  { id: 5, projectId: 2, title: 'รวบรวมความต้องการ', description: 'สรุปความต้องการจากผู้ใช้', assignedTo: 2, status: 'Done', createdAt: '2026-10-24T09:00:00Z' },
];

let auditLog = [];
let nextProjectId = 3;
let nextTaskId = 6;
let nextAuditId = 1;
let simulateFailure = false;

function publicUser(user) {
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}

function getUserForToken(token) {
  const userId = Number(String(token ?? '').replace('mock-token-', ''));
  const user = users.find((candidate) => candidate.id === userId);
  if (!user || token !== `mock-token-${user.id}`) {
    throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง');
  }
  return user;
}

async function respond(data) {
  await wait();
  if (simulateFailure) {
    throw new Error('Mock API ถูกตั้งค่าให้จำลองความผิดพลาด');
  }
  return structuredClone(data);
}

function requireAdmin(user) {
  if (user.role !== 'admin') {
    throw new Error('ไม่มีสิทธิ์ดำเนินการนี้');
  }
}

export function setMockApiFailure(enabled) {
  simulateFailure = Boolean(enabled);
}

export const api = {
  async login(username, password) {
    await wait();
    if (simulateFailure) {
      throw new Error('Mock API ถูกตั้งค่าให้จำลองความผิดพลาด');
    }
    const user = users.find(
      (candidate) => candidate.username === username && candidate.password === password
    );
    if (!user) {
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    return { user: publicUser(user), token: `mock-token-${user.id}` };
  },

  async getTasks(token) {
    const user = getUserForToken(token);
    const visibleTasks =
      user.role === 'admin'
        ? tasks
        : tasks.filter((task) => task.assignedTo === user.id);
    return respond({ tasks: visibleTasks });
  },

  async getProjects(token) {
    getUserForToken(token);
    return respond({ projects });
  },

  async getEmployees(token) {
    const user = getUserForToken(token);
    requireAdmin(user);
    return respond({ employees: users.filter((candidate) => candidate.role === 'employee').map(publicUser) });
  },

  async createProject(token, input) {
    const user = getUserForToken(token);
    requireAdmin(user);
    const name = String(input.name ?? '').trim();
    if (!name) {
      throw new Error('กรุณาระบุชื่อ Project');
    }
    const project = { id: nextProjectId++, name, description: String(input.description ?? '').trim() };
    await respond(project);
    projects = [...projects, project];
    return structuredClone(project);
  },

  async createTask(token, input) {
    const user = getUserForToken(token);
    requireAdmin(user);
    const title = String(input.title ?? '').trim();
    const projectId = Number(input.projectId);
    const assignedTo = Number(input.assignedTo);
    const projectExists = projects.some((project) => project.id === projectId);
    const employeeExists = users.some(
      (candidate) => candidate.id === assignedTo && candidate.role === 'employee'
    );
    if (!title || !projectExists || !employeeExists) {
      throw new Error('กรุณากรอกข้อมูลงานให้ครบและเลือก Project/Employee ที่ถูกต้อง');
    }
    const task = {
      id: nextTaskId++,
      projectId,
      title,
      description: String(input.description ?? '').trim(),
      assignedTo,
      status: 'To Do',
      createdAt: new Date().toISOString(),
    };
    await respond(task);
    tasks = [...tasks, task];
    return structuredClone(task);
  },

  async updateStatus(token, taskId, nextStatus) {
    const user = getUserForToken(token);
    const task = tasks.find((candidate) => candidate.id === Number(taskId));
    if (!task) {
      throw new Error('ไม่พบ Task นี้');
    }
    if (!['To Do', 'Done'].includes(nextStatus)) {
      throw new Error('สถานะไม่ถูกต้อง');
    }
    if (user.role !== 'admin' && task.assignedTo !== user.id) {
      throw new Error('ไม่มีสิทธิ์แก้ไข Task นี้');
    }
    if (
      user.role !== 'admin' &&
      !(task.status === 'To Do' && nextStatus === 'Done')
    ) {
      throw new Error('Employee เปลี่ยนได้เฉพาะ To Do เป็น Done');
    }

    const updatedTask = { ...task, status: nextStatus };
    await respond(updatedTask);
    tasks = tasks.map((candidate) => (candidate.id === task.id ? updatedTask : candidate));
    if (task.status !== nextStatus) {
      auditLog = [
        ...auditLog,
        {
          id: nextAuditId++,
          taskId: task.id,
          userId: user.id,
          oldStatus: task.status,
          newStatus: nextStatus,
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return structuredClone(updatedTask);
  },

  async getAuditLog(token) {
    const user = getUserForToken(token);
    requireAdmin(user);
    return respond({ auditLog });
  },
};
