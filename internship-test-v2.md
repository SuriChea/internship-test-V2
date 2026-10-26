# แบบทดสอบคัดเลือกนักศึกษาฝึกงาน

---

## รายละเอียดการทดสอบ
- **เวลาในการทำแบบทดสอบ:** 3 ชั่วโมง (ส่วนที่ 1–4) · ส่วนที่ 5 สัมภาษณ์
- **คะแนนรวม:** 100 คะแนน = ชิ้นงาน 60 + สัมภาษณ์ 40
- **เครื่องมือ:** อนุญาตให้ใช้ AI (ChatGPT, Claude, Gemini, Copilot ฯลฯ) ได้ทุกขั้นตอน 100%
- **การส่งงาน:** สร้าง Public Repository บน GitHub/GitLab แล้วส่งลิงก์เมื่อหมดเวลา

### กติกาเรื่อง Git (มีผลต่อคะแนน)
1. **Commit แรกภายใน 15 นาทีแรก** เป็นโครง repo พร้อมไฟล์ `START.md` ที่ระบุเวลาเริ่มทำ
2. **Commit อย่างน้อยทุก 30 นาที** ข้อความ commit ต้องบอกว่าทำอะไร ไม่ใช่ "update" หรือ "fix"
3. ประวัติ commit เป็นส่วนหนึ่งของการประเมิน: เราดูลำดับการคิดและการแก้ไข ไม่ใช่แค่ผลสุดท้าย
4. ห้าม commit `node_modules`, `.env` หรือไฟล์ที่มี secret


> ⚠️ **สำคัญ:** ใช้ AI ได้เต็มที่ แต่ทุกบรรทัดที่ส่งมาคุณต้องอธิบายได้ ส่วนที่ 5 คือการเปิดโค้ดของคุณเองแล้วถาม และอาจให้แก้โค้ดสดโดยไม่ใช้ AI
> ⚠️ **เกณฑ์ขั้นต่ำ:** ส่วนที่ 3 ต้องรันได้ตามที่เขียนใน README หากรันไม่ได้จะไม่เรียกสัมภาษณ์ในทุกกรณี

---

# ส่วนที่ 1: System Design & Decision Log (10 คะแนน)


## โจทย์
ออกแบบระบบ **"จัดการสิทธิ์การเข้าถึงข้อมูลโครงการ (Project Access Control)"** โดยมีกฎดังนี้
- **Admin:** สร้าง Project, สร้าง Task, มอบหมาย Task ให้พนักงานคนใดก็ได้, เปลี่ยนสถานะ Task ใดก็ได้
- **Employee:** เห็นและเปลี่ยนสถานะได้เฉพาะ Task ที่ตนเองได้รับมอบหมาย และเปลี่ยนได้เฉพาะ To Do → Done

## สิ่งที่ต้องส่งมอบ (โฟลเดอร์ `section-1/`)

### 1.1 Flowchart (5 คะแนน)
ไฟล์รูปภาพ หรือ Mermaid/Draw.io/Excalidraw ที่เปิดดูได้โดยไม่ต้องติดตั้งอะไร แสดง flow ของระบบ **ต้องครอบคลุมกรณีต่อไปนี้ทั้งหมด**
- Login สำเร็จ / ไม่สำเร็จ
- Employee พยายามเข้า `/admin` และ Admin พยายามเข้า `/employee`
- Employee พยายามเปลี่ยนสถานะ Task ที่ไม่ใช่ของตัวเอง
- Employee พยายามเปลี่ยน Task ที่ Done แล้วกลับเป็น To Do
- Logout

### 1.2 บันทึกเหตุผล (5 คะแนน) — ไฟล์ `DECISIONS.md`

ระหว่างทำแบบทดสอบ คุณจะต้องเลือกหลายอย่าง เช่น จะเก็บข้อมูลผู้ใช้ที่ login ไว้ตรงไหน จะใช้ library ไหนทำ routing หรือจะออกแบบตารางแบบไหน
**ให้เลือกมา 5 เรื่องที่คุณคิดว่าสำคัญที่สุด แล้วเขียนว่าตอนนั้นมีทางเลือกอะไรบ้าง เลือกทางไหน เพราะอะไร และทางที่เลือกมีข้อเสียอะไรที่คุณยอมรับ**

ตัวอย่างที่กรอกแล้ว 1 ข้อ:

```
## D1: จะเก็บข้อมูลผู้ใช้ที่ login (ชื่อ, role) ไว้ตรงไหน
- ทางเลือกที่คิดไว้: (A) React Context  (B) Redux  (C) ส่งเป็น props ลงไปทุกหน้า
- เลือก: A
- เพราะ: ข้อมูลที่ต้องแชร์ข้ามหน้ามีแค่ชุดเดียวและเปลี่ยนเฉพาะตอน login/logout
  Context ที่ React มีให้พอใช้ ไม่ต้องติดตั้งเพิ่ม
- ข้อเสียของ A ที่ยอมรับ: ถ้าอนาคตมี state แชร์เยอะขึ้น ทุก component ที่ใช้ Context
  จะ render ใหม่พร้อมกัน ตอนนั้นค่อยย้ายไป Redux หรือ zustand
```

เงื่อนไข:
- เขียน 5 ข้อ (D1–D5) ตามรูปแบบตัวอย่าง
- ในนั้นต้องมีเรื่องจากโค้ดส่วนที่ 3 อย่างน้อย 2 ข้อ และเรื่องการออกแบบตารางส่วนที่ 2 อย่างน้อย 1 ข้อ อีก 2 ข้อเรื่องอะไรก็ได้
- ท้ายไฟล์เขียนสั้นๆ 2–3 บรรทัดว่าใช้ AI ช่วยส่วนไหนบ้าง ส่วนนี้ไม่คิดคะแนน แต่ผู้สัมภาษณ์จะใช้ถามต่อ

---

# ส่วนที่ 2: Tech Stack & Database Design (10 คะแนน)


## สิ่งที่ต้องส่งมอบ (โฟลเดอร์ `section-2/` และสรุปใน `README.md`)

### 2.1 Tech Stack (3 คะแนน)
ระบุภาษา/Framework/Library ที่ใช้ในส่วนที่ 3 พร้อมเหตุผลว่าทำไมถึงเหมาะกับโจทย์นี้ (ไม่ใช่เหตุผลทั่วไปอย่าง "เป็นที่นิยม")

### 2.2 Database Schema (7 คะแนน) — ไฟล์ `schema.sql`
ออกแบบตารางสำหรับระบบจริง (ไม่ใช่ mock) อย่างน้อย `users`, `projects`, `tasks` ระบุ PK, FK, ชนิดข้อมูล, constraint ที่จำเป็น (เช่น ค่าสถานะที่อนุญาต) และ index ที่จำเป็นพร้อมบอกว่า index นั้นรองรับ query ไหน

---

# ส่วนที่ 3: Web Implementation (20 คะแนน)


## โจทย์
สร้าง Web App จัดการ Task อย่างง่าย **ใช้ Mock Data ไม่ต้องมี backend หรือฐานข้อมูลจริง**

### 3.1 Mock Data & Mock API
- Mock Data มีผู้ใช้ role `admin` และ `employee` อย่างน้อยอย่างละ 1 บัญชี และมี Task อย่างน้อย 5 รายการ กระจายให้ employee มากกว่า 1 คน
- หน้า Login แบบง่าย (กรอก username หรือเลือกจาก dropdown) โดย **การตรวจสอบต้องผ่านฟังก์ชันจำลอง API ** (`Promise` + `setTimeout`) และ UI ต้องแสดงสถานะกำลังโหลด

### 3.2 Route Guard
- Admin เข้า `/admin` ได้ · Employee เข้า `/employee` ได้
- เข้า URL ของอีก role → redirect ไปหน้าของตัวเองพร้อมข้อความแจ้ง
- ยังไม่ Login → redirect ไป login

### 3.3 ฟีเจอร์
- **หน้า Admin:** แสดง Task ทั้งหมด + สร้าง Task ใหม่ (ระบุชื่อและผู้รับผิดชอบ) แล้วรายการต้องอัปเดตทันที
- **หน้า Employee:** แสดงเฉพาะ Task ของตัวเอง + ปุ่มเปลี่ยน `To Do → Done` และต้องไม่สามารถย้อนกลับได้
- ทุกการเรียก mock API ต้องมี loading state และกรณี error (จำลองได้ เช่น username ไม่มีในระบบ)

### เกณฑ์
**เกณฑ์ขั้นต่ำ (12 คะแนน — ต้องผ่านทุกข้อจึงจะเรียกสัมภาษณ์):**
- `npm install` แล้ว `npm run dev` (หรือคำสั่งที่ระบุใน README) รันได้ทันที
- Login ได้ทั้ง 2 role และ guard ทำงานครบ 3 กรณีในข้อ 3.2
- Admin สร้าง Task แล้วเห็นทันที · Employee เห็นเฉพาะของตัวเองและกด Done ได้

**คุณภาพ (8 คะแนน):** แยกไฟล์เป็นสัดส่วน (mock api / หน้า / state / guard), state อยู่ในที่ที่เหมาะสมและไม่ซ้ำซ้อน, มี loading/error ครบ, README บอกวิธีรันและบัญชีทดสอบ

> ไม่ต้องทำเกินโจทย์ ฟีเจอร์ที่ไม่ได้ขอไม่ได้คะแนนเพิ่ม

---

# ส่วนที่ 4: Debugging & Code Review (20 คะแนน)


## ระบบนี้ต้องทำงานแบบไหน (ใช้เทียบว่าโค้ดผิดตรงไหน)

โค้ด 2 ไฟล์ด้านล่างมาจากระบบ Task เดียวกับส่วนที่ 1–3 แต่เป็นเวอร์ชันที่มี backend จริง (Node.js + Express + PostgreSQL) และหน้า React ทั้งสองไฟล์รันได้ และทำงานถูกในบางเคส แต่ไม่ครบตามกฎข้างล่างนี้

**API มี 3 เส้น**
- `GET /api/tasks` ดูรายการ task (ทุกคนที่ login)
- `PATCH /api/tasks/:id/status` เปลี่ยนสถานะ ส่ง `{ "status": "Done" }` (ทุกคนที่ login)
- `DELETE /api/tasks/:id` ลบ task (Admin เท่านั้น)

**กฎที่ระบบต้องทำตาม**
- Admin เปลี่ยนสถานะ task ของใครก็ได้ และย้อนจาก Done กลับเป็น To Do ได้
- Employee เปลี่ยนได้เฉพาะ task ของตัวเอง และได้แค่ To Do → Done
- สถานะมีแค่ `To Do` กับ `Done`
- ทุกครั้งที่เปลี่ยนสถานะสำเร็จ ต้องมีแถวใหม่ใน `audit_log`

**หน้า Employee (ไฟล์ที่ 2) ต้องทำได้**
- แสดงเฉพาะ task ของตัวเอง และกรองตามสถานะได้
- กดปุ่ม Done แล้วหน้าจอต้องเปลี่ยนทันที และสิ่งที่เห็นต้องตรงกับที่ server บันทึกไว้จริง (ถ้า server บันทึกไม่สำเร็จ หน้าจอต้องไม่โชว์ว่า Done)
- ดึงข้อมูลใหม่เองทุก 10 วินาทีตลอดเวลาที่เปิดหน้านี้ และต้องหยุดเมื่อออกจากหน้า

**สิ่งที่ถือว่าถูกต้องอยู่แล้ว ไม่ต้องแก้**
- `authenticate` ตรวจ token แล้วใส่ `req.user = { id, role }` ให้ ถ้าไม่มี token หรือ token ผิด มันตอบ 401 เอง
- `api.getTasks(token)` คืน `{ tasks: [...] }` และ `api.updateStatus(token, id, status)` คืน task ที่อัปเดตแล้ว ทั้งคู่จะ reject ถ้า server ตอบไม่ใช่ 2xx


## โจทย์
1. หาบั๊กให้ครบ ระบุ **ไฟล์และเลขบรรทัด** จัดประเภท (security / logic / async / validation / UI) และความรุนแรง (critical / high / medium / low)
2. แก้โค้ดทั้งสองไฟล์ให้ถูกต้องตามสเปค
3. ทุกบั๊กให้เขียน **"วิธีพิสูจน์" 1 ประโยค** ว่าถ้าลองทำอะไรกับโค้ดเดิม จะเห็นว่ามันพัง และหลังแก้แล้วต้องได้ผลอะไรแทน ไม่ต้องเขียนเป็นโค้ด เขียนเป็นประโยคในรูป


   ตัวอย่างที่ดี:
   - ทำ: Employee ที่เป็นเจ้าของ task #3 ส่ง `PATCH /api/tasks/3/status` พร้อม `{ status: "Done" }` → โค้ดเดิมได้: 403 → ที่ถูกต้องคือ: 200 และ status เป็น Done
   - ทำ: เปิดหน้า Employee แล้วกดปุ่ม "เปลี่ยนเป็น Done" ที่แถวแรก → โค้ดเดิมได้: ข้อความบนจอยังเป็น To Do จนกว่าจะรอ 10 วินาที → ที่ถูกต้องคือ: เปลี่ยนเป็น Done ทันที

   ตัวอย่างที่ไม่ได้คะแนน:
   - "ทดสอบว่า endpoint ทำงานถูกต้อง" (ไม่บอกว่าทำอะไร ได้อะไร)
   - "เพิ่ม unit test ให้ฟังก์ชันนี้" (ไม่ใช่วิธีพิสูจน์ เป็นแค่คำแนะนำ)

   เหตุผลที่ให้เขียน: ถ้าคุณอธิบายไม่ได้ว่าจะทำให้บั๊กโผล่ยังไง แปลว่ายังไม่เข้าใจว่ามันพังเพราะอะไร และผู้ตรวจจะใช้ประโยคนี้ลองกับโค้ดของคุณจริง
4. **โค้ดมีจุดที่ดูเหมือนบั๊กแต่ถูกต้องอยู่ด้วย** ถ้าไม่แน่ใจให้แยกไว้ในหัวข้อ "จุดที่สงสัย" พร้อมเหตุผล

## ไฟล์ที่ 1: `routes/tasks.js`

```javascript
const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const ALLOWED_STATUSES = ['To Do', 'Done'];
const PAGE_SIZE = 20;

router.get('/api/tasks', authenticate, async (req, res) => {
  const { projectId, page = 1 } = req.query;
  const offset = (page - 1) * PAGE_SIZE;

  try {
    let sql = 'SELECT * FROM tasks';
    const params = [];

    if (projectId) {
      params.push(projectId);
      sql += ` WHERE project_id = $${params.length}`;
    }

    if (req.user.role !== 'admin') {
      sql += ` AND assigned_to = ${req.user.id}`;
    }

    sql += ` ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`;

    const result = await db.query(sql, params);
    return res.status(200).json({ tasks: result.rows, page });
  } catch (err) {
    console.error('GET /api/tasks failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/api/tasks/:id/status', authenticate, async (req, res) => {
  const taskId = Number(req.params.id);
  const { status } = req.body;

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = rows[0];
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = task.assigned_to === req.user.id;

    if (!isAdmin || !isOwner) {
      return res.status(403).json({ message: 'No permission to edit this task' });
    }

    if (!isAdmin && task.status === 'Done' && status === 'To Do') {
      return res.status(409).json({ message: 'Cannot reopen a finished task' });
    }

    await db.query(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, taskId]
    );

    db.query(
      'INSERT INTO audit_log (task_id, user_id, action) VALUES ($1, $2, $3)',
      [taskId, req.user.id, `status:${status}`]
    );

    return res.status(200).json({ task: { ...task, status } });
  } catch (err) {
    console.error('PATCH /api/tasks/:id/status failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/api/tasks/:id', async (req, res) => {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  return res.status(204).end();
});

module.exports = router;
```

## ไฟล์ที่ 2: `pages/EmployeeTasks.jsx`

```jsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function EmployeeTasks() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getTasks(token).then((data) => {
      setTasks(data.tasks);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      api.getTasks(token).then((data) => setTasks(data.tasks));
    }, 10000);
  }, [token]);

  const visible = tasks.filter(
    (t) => t.assigned_to === user.id && (filter === 'All' || t.status === filter)
  );

  const markDone = async (task) => {
    const target = tasks.find((t) => t.id === task.id);
    target.status = 'Done';
    setTasks(tasks);

    try {
      await api.updateStatus(token, task.id, 'Done');
    } catch (e) {
      setError('อัปเดตไม่สำเร็จ');
    }
  };

  return (
    <div className="page">
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option>All</option>
        <option>To Do</option>
        <option>Done</option>
      </select>

      {loading && <p>กำลังโหลด...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {visible.map((t, i) => (
          <li key={i}>
            {t.title} — {t.status}
            {t.status !== 'Done' && (
              <button onClick={() => markDone(t)}>เปลี่ยนเป็น Done</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## สิ่งที่ต้องส่งมอบ (โฟลเดอร์ `section-4/`)
1. `tasks.js` และ `EmployeeTasks.jsx` ที่แก้แล้ว (ไม่ต้องเขียน middleware, `db`, หรือ `api` จริง)
2. `BUGS.md` ตารางบั๊กตามรูปแบบนี้เรียงจากรุนแรงมากไปน้อย

| # | ไฟล์:บรรทัด | ประเภท | ความรุนแรง | ปัญหา (เกิดอะไร เมื่อไหร่) | วิธีแก้ | วิธีพิสูจน์ |

(ตัวอย่างในตารางเป็นไฟล์สมมติ ไม่ใช่บั๊กในโจทย์)

และหัวข้อท้ายไฟล์ **"จุดที่สงสัย"** (ถ้ามี)

> ให้คะแนนตาม: บั๊กที่เจอและแก้ถูก · วิธีพิสูจน์ที่ใช้ได้จริง · การจัดลำดับความรุนแรง

---

# ส่วนที่ 5: Interview (40 คะแนน)


---

# 📦 รูปแบบการส่งงาน

```
intern-test-[YOUR_NAME]/
├── README.md              # วิธีรัน, บัญชีทดสอบ, Tech stack
├── START.md               # เวลาเริ่มทำ
├── section-1/
│   ├── flowchart.*        # รูปหรือไฟล์ที่เปิดดูได้
│   └── DECISIONS.md
├── section-2/
│   └── schema.sql
├── section-3/             # Source code ของเว็บแอป
│   ├── src/
│   └── package.json
└── section-4/
    ├── tasks.js
    ├── EmployeeTasks.jsx
    └── BUGS.md
```

**ขอให้โชคดีครับ**
