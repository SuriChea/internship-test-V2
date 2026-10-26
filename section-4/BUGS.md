# รายงานบั๊ก

คอลัมน์โค้ดแสดงบรรทัดจาก snippet ต้นฉบับในโจทย์ที่ทำให้เกิดบั๊ก

| # | ไฟล์ / โค้ดบรรทัดที่มีปัญหา | ประเภท | ความรุนแรง | ปัญหา | วิธีแก้ | วิธีพิสูจน์ |
|---|---|---|---|---|---|---|
| 1 | `routes/tasks.js`<br>`router.delete('/api/tasks/:id', async (req, res) => {` | security | high | Route ลบ Task ไม่มี `authenticate`; หากไม่มี `req.user`, เงื่อนไขตรวจ role ไม่ป้องกันการลบ | เพิ่ม `authenticate` และอนุญาตเฉพาะ Admin | ทำ: เรียก DELETE โดยไม่ส่ง token → โค้ดเดิมได้: ลบ Task → ที่ถูกต้องคือ: ตอบ 401 และไม่ลบ |
| 2 | `routes/tasks.js`<br>`if (!isAdmin || !isOwner) {` | logic | high | เงื่อนไขนี้ปฏิเสธทั้ง Employee เจ้าของ Task และ Admin ที่ไม่ได้เป็นเจ้าของ | เปลี่ยนเป็น `if (!isAdmin && !isOwner)` | ทำ: Employee เจ้าของ Task ส่งสถานะ Done → โค้ดเดิมได้: 403 → ที่ถูกต้องคือ: 200 และสถานะเป็น Done |
| 3 | `routes/tasks.js`<br>`sql += \` AND assigned_to = \${req.user.id}\`;` | logic | high | เมื่อไม่มี `projectId`, SQL ไม่มี `WHERE` แต่เพิ่ม `AND assigned_to` ทำให้ query ผิด | สร้าง `WHERE` ก่อนเพิ่มเงื่อนไข Employee | ทำ: Employee เรียก GET `/api/tasks` โดยไม่ส่ง `projectId` → โค้ดเดิมได้: 500 → ที่ถูกต้องคือ: 200 พร้อม Task ของตน |
| 4 | `routes/tasks.js`<br>`db.query(`<br>`  'INSERT INTO audit_log (task_id, user_id, action) VALUES ($1, $2, $3)',` | async | high | ไม่ `await` การเพิ่ม audit log; API อาจตอบสำเร็จก่อนรู้ว่าบันทึก log สำเร็จหรือไม่ | รอผล insert และใช้ transaction ครอบการแก้ Task กับการเพิ่ม log | ทำ: ทำให้ INSERT audit log ล้มเหลว → โค้ดเดิมได้: อาจเปลี่ยนสถานะโดยไม่มี log → ที่ถูกต้องคือ: ยกเลิกการเปลี่ยนสถานะและตอบ error |
| 5 | `pages/EmployeeTasks.jsx`<br>`target.status = 'Done';`<br>`setTasks(tasks);` | async / UI | high | เปลี่ยนสถานะใน state ก่อน API สำเร็จ; เมื่อ API ล้มเหลวไม่มีการคืนค่าเดิม | รอ API สำเร็จแล้วค่อยอัปเดต state ด้วย Task ที่ API ส่งกลับ | ทำ: กด Done แล้วให้ API ล้มเหลว → โค้ดเดิมได้: state เป็น Done → ที่ถูกต้องคือ: คง To Do และแสดง error |
| 6 | `pages/EmployeeTasks.jsx`<br>`api.getTasks(token).then((data) => {` | async | medium | การโหลดครั้งแรกไม่มี `catch`; ถ้า API reject จะไม่แสดง error และ `loading` ไม่ถูกปิด | จับ error และปิด loading ใน `finally` | ทำ: ให้ `getTasks` ล้มเหลวตอนเปิดหน้า → โค้ดเดิมได้: loading ค้าง → ที่ถูกต้องคือ: ปิด loading และแสดง error |
| 7 | `pages/EmployeeTasks.jsx`<br>`const timer = setInterval(() => {` | async | medium | ตั้ง interval แต่ไม่มี cleanup; เมื่อออกจากหน้า timer ยังเรียก API ต่อ และไม่มี `catch` หาก API ล้มเหลว | จับ error และ `clearInterval` ตอน component ถูกปิด | ทำ: ออกจากหน้าแล้วรอเกิน 10 วินาที → โค้ดเดิมได้: ยังเรียก `getTasks` → ที่ถูกต้องคือ: polling หยุด |
| 8 | `routes/tasks.js`<br>`const taskId = Number(req.params.id);` | validation | low | แปลง task ID เป็น Number แต่ไม่ตรวจว่าถูกต้องก่อน query | ตรวจว่า ID เป็นเลขบวกที่ถูกต้อง ถ้าไม่ใช่ตอบ 400 | ทำ: ส่ง PATCH ไป `/api/tasks/abc/status` → โค้ดเดิมได้: ส่ง `NaN` ไป query → ที่ถูกต้องคือ: ตอบ 400 |
| 9 | `pages/EmployeeTasks.jsx`<br>`<li key={i}>` | UI | low | ใช้ index (`i`) เป็น React key แทน ID ของ Task | เปลี่ยนเป็น `key={t.id}` | ทำ: เปลี่ยนลำดับ Task ในรายการ → โค้ดเดิมได้: key เดิมอาจถูกใช้กับ Task คนละรายการ → ที่ถูกต้องคือ: แต่ละ Task ใช้ ID ของตัวเองเป็น key |

## จุดที่สงสัย

- `authenticate` ถูกกำหนดในโจทย์ว่าตรวจ token และตอบ 401 ให้อยู่แล้ว จึงไม่ใช่บั๊กของ middleware
- โค้ดในตารางเป็น snippet ต้นฉบับเฉพาะบรรทัดที่เกี่ยวกับบั๊ก ไม่ใช่โค้ดฉบับแก้ไข
