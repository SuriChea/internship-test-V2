<<<<<<< HEAD
# Internship Test — Project Access Control

เว็บแอปตัวอย่างสำหรับจัดการ Task โดยเน้นการควบคุมสิทธิ์ Admin/Employee, โค้ดที่แยกหน้าที่ชัดเจน และการบันทึกเหตุผลในการตัดสินใจออกแบบ

## Tech Stack

- **JavaScript + React** — ใช้สร้างหน้าจอและแบ่ง UI เป็น component
- **Vite** — ใช้เริ่ม development server และ build เว็บแอปได้สะดวก
- **React Router** — แยกหน้าและป้องกันเส้นทางตามสถานะ login และ role
- **React Context** — เก็บสถานะผู้ใช้และ token สำหรับแชร์ระหว่างหน้า
- **Mock API ในหน่วยความจำ** — จำลองการเรียก server แบบ asynchronous โดยไม่ต้องมี backend ตามโจทย์
- **Tailwind CSS 4** — จัด layout และสถานะของ UI ใน JSX โดยใช้ utility classes
- **PostgreSQL (เฉพาะ schema ที่ออกแบบ)** — ใช้แสดงแบบฐานข้อมูลสำหรับระบบจริงใน Section 2; เว็บแอป Section 3 ไม่เชื่อมต่อฐานข้อมูล

## วิธีเริ่มเว็บแอป

เปิด terminal ที่โฟลเดอร์ `section-3` แล้วรัน:

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน terminal (โดยปกติคือ `http://localhost:5173`)

## บัญชีทดสอบ

บัญชีด้านล่างเป็นบัญชี mock สำหรับเว็บแอปใน Section 3:

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Employee | `employee1` | `employee123` |
| Employee | `employee2` | `employee123` |

> บัญชีและข้อมูลทั้งหมดเป็นข้อมูลจำลอง ไม่มีการเชื่อมต่อ backend หรือฐานข้อมูลจริง

## โครงสร้าง Repository

```text
intership-test-V2/
├── README.md
├── START.md
├── section-1/
│   ├── flowchart.mmd
│   └── DECISIONS.md
├── section-2/
│   └── schema.sql
├── section-3/
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/
│       ├── routes/
│       ├── services/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
└── section-4/
    ├── tasks.js
    ├── EmployeeTasks.jsx
    └── BUGS.md
```

## Section ที่ส่งมอบ

1. **Section 1 — System Design:** Mermaid flowchart และ Decision Log D1–D5
2. **Section 2 — Database Design:** PostgreSQL schema สำหรับ users, projects, tasks และ audit log
3. **Section 3 — Web App:** React app ด้วย mock data/API, loading/error states, role route guards และ UI แยกตาม role
4. **Section 4 — Debugging:** แก้ Express route และหน้า Employee พร้อมรายงานบั๊กและวิธีพิสูจน์

## วิธีจำลอง API Error

ในโค้ด `section-3/src/services/mockApi.js` มี `setMockApiFailure(true)` สำหรับทดสอบ error handling; ค่าเริ่มต้นปิดการจำลอง error เพื่อให้แอปใช้งานได้ปกติ

## กฎสิทธิ์หลัก

- Admin สร้าง Project และ Task, มอบหมาย Task ให้พนักงานคนใดก็ได้ และเปลี่ยนสถานะ Task ใดก็ได้ รวมถึง `Done` กลับเป็น `To Do`
- Employee เห็นและเปลี่ยนสถานะได้เฉพาะ Task ที่มอบหมายให้ตนเอง และเปลี่ยนได้เฉพาะ `To Do` เป็น `Done`
- สถานะ Task มีเพียง `To Do` และ `Done`
- การเปลี่ยนสถานะสำเร็จต้องบันทึก audit log ในส่วนที่ออกแบบสำหรับระบบจริง
=======
# internship-test-V2
>>>>>>> d0330481366f45f1d9fdde2f9358011c6cb22879
