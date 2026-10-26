# รายงานบั๊ก

เลขบรรทัดนับจากบรรทัดแรกของ code block ต้นฉบับในโจทย์ และเริ่มนับใหม่แยกตามไฟล์

| # | ไฟล์:บรรทัด | ประเภท | ความรุนแรง | ปัญหา | วิธีแก้ | วิธีพิสูจน์ |
|---|---|---|---|---|---|---|
| 1 | `routes/tasks.js:78-85` | security | high | DELETE ไม่มี `authenticate` ทำให้คนที่ไม่ login อาจลบ Task ได้ | เพิ่ม `authenticate` และอนุญาตเฉพาะ Admin | ทำ: ส่ง DELETE โดยไม่แนบ token → โค้ดเดิมได้: ลบ Task สำเร็จ → ที่ถูกต้องคือ: ตอบ 401 และไม่ลบ Task |
| 2 | `routes/tasks.js:53-55` | logic | high | เงื่อนไข `!isAdmin || !isOwner` ทำให้ Employee แก้ Task ของตัวเองไม่ได้ และ Admin แก้ Task ของคนอื่นไม่ได้ | ใช้ `!isAdmin && !isOwner` เพื่อปฏิเสธเฉพาะคนที่ไม่ใช่ Admin และไม่ใช่เจ้าของ | ทำ: Employee เจ้าของ Task ส่งสถานะ Done → โค้ดเดิมได้: 403 → ที่ถูกต้องคือ: 200 และ Task เป็น Done |
| 3 | `routes/tasks.js:21-22` | logic | high | ถ้า Employee เรียกโดยไม่ส่ง `projectId` จะต่อ `AND` โดยไม่มี `WHERE` ทำให้ SQL ผิด | สร้าง `WHERE` ก่อนเพิ่มเงื่อนไข Employee | ทำ: Employee เรียก GET `/api/tasks` โดยไม่ส่ง `projectId` → โค้ดเดิมได้: 500 → ที่ถูกต้องคือ: 200 พร้อม Task ของตัวเอง |
| 4 | `routes/tasks.js:66-69` | async | high | ไม่รอผลการเขียน audit log; อาจตอบว่าสำเร็จทั้งที่บันทึก log ไม่สำเร็จ | รอการเขียน log และใช้ transaction ร่วมกับการเปลี่ยนสถานะ | ทำ: ทำให้ INSERT audit log ล้มเหลว → โค้ดเดิมได้: สถานะเปลี่ยนแต่ไม่มี log → ที่ถูกต้องคือ: ยกเลิกการเปลี่ยนสถานะและตอบ error |
| 5 | `pages/EmployeeTasks.jsx:30-38` | async / UI | high | เปลี่ยน Task เป็น Done ก่อน server ตอบ; เมื่อบันทึกไม่สำเร็จ state ในหน้าจออาจไม่ตรงกับ server | รอ API สำเร็จแล้วจึงอัปเดต state ด้วยข้อมูลที่ server ส่งกลับ | ทำ: กด Done แล้วให้ API ตอบ error → โค้ดเดิมได้: Task ถูกเปลี่ยนเป็น Done ใน state → ที่ถูกต้องคือ: คง To Do และแสดง error |
| 6 | `pages/EmployeeTasks.jsx:12-18` | async | medium | ถ้าโหลด Task ไม่สำเร็จ ไม่มีการจับ error และปิด loading | เพิ่ม `catch` และ `finally` | ทำ: ให้ `getTasks` ล้มเหลวตอนเปิดหน้า → โค้ดเดิมได้: loading ค้าง → ที่ถูกต้องคือ: ปิด loading และแสดง error |
| 7 | `pages/EmployeeTasks.jsx:20-23` | async | medium | polling ไม่มี `catch` และไม่มี cleanup; ออกจากหน้าแล้ว timer ยังทำงาน | จับ error และเรียก `clearInterval` ตอนออกจากหน้า | ทำ: เปิดหน้าแล้วออก จากนั้นรอ 10 วินาที → โค้ดเดิมได้: ยังเรียก API → ที่ถูกต้องคือ: หยุด polling |
| 8 | `routes/tasks.js:36` | validation | low | ไม่ตรวจว่า task ID เป็นเลขบวกก่อน query ฐานข้อมูล | ตรวจ ID ก่อน query และตอบ 400 หากไม่ถูกต้อง | ทำ: ส่ง PATCH ไปที่ `/api/tasks/abc/status` → โค้ดเดิมได้: ส่งค่า NaN ไป query → ที่ถูกต้องคือ: ตอบ 400 |
| 9 | `pages/EmployeeTasks.jsx:54` | UI | low | ใช้ index เป็น key แทน ID ของ Task | ใช้ `t.id` เป็น key | ทำ: เปลี่ยนลำดับรายการ Task → โค้ดเดิมได้: React อาจจับคู่รายการผิด → ที่ถูกต้องคือ: ใช้ ID ของ Task ระบุแต่ละรายการ |

## จุดที่สงสัย

- `authenticate` ถูกกำหนดไว้แล้วว่าให้ตอบ 401 เมื่อ token หายหรือไม่ถูกต้อง จึงไม่ใช่บั๊กใน middleware
