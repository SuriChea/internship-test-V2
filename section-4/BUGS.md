# รายงานบั๊ก

เลขบรรทัดด้านล่างอ้างอิงจากโค้ดต้นฉบับในโจทย์ โดยนับแยกในแต่ละไฟล์

| # | ไฟล์:บรรทัด | ประเภท | ความรุนแรง | ปัญหา | วิธีแก้ | วิธีพิสูจน์ |
|---|---|---|---|---|---|---|
| 1 | `routes/tasks.js:74-77` | security | high | DELETE ไม่เรียก `authenticate` จึงลบ Task ได้เมื่อไม่ส่ง token | เพิ่ม `authenticate` และอนุญาตเฉพาะ Admin | ทำ: ส่ง `DELETE /api/tasks/1` โดยไม่ส่ง token → โค้ดเดิมได้: ลบ Task สำเร็จ → ที่ถูกต้องคือ: ตอบ 401 และไม่ลบ Task |
| 2 | `routes/tasks.js:53-55` | logic | high | เงื่อนไข `!isAdmin || !isOwner` ทำให้ต้องเป็นทั้ง Admin และเจ้าของ จึงห้าม Employee แก้ Task ของตัวเอง และห้าม Admin แก้ Task ของคนอื่น | เปลี่ยนเป็นปฏิเสธเมื่อไม่ใช่ Admin และไม่ใช่เจ้าของ (`!isAdmin && !isOwner`) | ทำ: Employee เจ้าของ Task ส่งคำขอเปลี่ยนเป็น Done → โค้ดเดิมได้: 403 → ที่ถูกต้องคือ: 200 และเปลี่ยนสถานะสำเร็จ |
| 3 | `routes/tasks.js:63-65` | async / logic | high | ไม่รอผลการเพิ่ม audit log และไม่ได้ใช้ transaction; สถานะอาจเปลี่ยนแล้วแต่ไม่มี audit log | รอการบันทึก audit log และทำ update กับ audit log ใน transaction เดียวกัน | ทำ: ทำให้การเพิ่ม audit log ล้มเหลว แล้วเปลี่ยนสถานะ Task → โค้ดเดิมได้: สถานะอาจเปลี่ยนโดยไม่มี audit log → ที่ถูกต้องคือ: ยกเลิกการเปลี่ยนสถานะและตอบ error |
| 4 | `routes/tasks.js:21-22` | logic | high | เมื่อไม่ส่ง `projectId` จะต่อ `AND` โดยไม่มี `WHERE` ทำให้ query ของ Employee ผิด | ประกอบเงื่อนไขค้นหาแล้วค่อยเพิ่ม `WHERE` และ `AND` | ทำ: Employee เรียก `GET /api/tasks` โดยไม่ส่ง `projectId` → โค้ดเดิมได้: query ผิดและตอบ 500 → ที่ถูกต้องคือ: ตอบ 200 พร้อมเฉพาะ Task ของตน |
| 5 | `pages/EmployeeTasks.jsx:12-18` | async / UI | medium | ถ้าโหลด Task ไม่สำเร็จ ไม่มีการจับ error และปิด loading | เพิ่ม `catch` แสดง error และใช้ `finally` ปิด loading | ทำ: ให้ `getTasks` ล้มเหลวตอนเปิดหน้า → โค้ดเดิมได้: ค้างที่กำลังโหลดและไม่แจ้ง error → ที่ถูกต้องคือ: หยุด loading และแสดง error |
| 6 | `pages/EmployeeTasks.jsx:20-24` | async | medium | polling ไม่มี `catch` และไม่มี cleanup จึงอาจเกิด unhandled error และยังเรียก API หลังออกจากหน้า | จับ error และ `clearInterval` เมื่อ component ถูกปิด | ทำ: เปิดหน้าแล้วออกจากหน้าก่อนครบ 10 วินาที → โค้ดเดิมได้: interval ยังเรียก API ต่อ → ที่ถูกต้องคือ: หยุด polling เมื่อออกจากหน้า |
| 7 | `pages/EmployeeTasks.jsx:31-36` | UI / async | medium | แก้ Task ใน state ก่อน server ตอบ และไม่ใช้ Task ที่ API ส่งกลับ; ถ้าบันทึกไม่สำเร็จ หน้าจอก็อาจแสดง Done | รอ API สำเร็จก่อน แล้วอัปเดต state ด้วยข้อมูลที่ API คืน | ทำ: กด Done แล้วให้ `updateStatus` ล้มเหลว → โค้ดเดิมได้: หน้าจออาจแสดง Done ทั้งที่บันทึกไม่สำเร็จ → ที่ถูกต้องคือ: คง To Do และแสดง error |
| 8 | `routes/tasks.js:36, 44-45` | validation | low | ไม่ตรวจว่า task ID เป็นเลขบวกที่ถูกต้องก่อน query; ID ที่ไม่ใช่ตัวเลขอาจทำให้ได้ 500 แทน 400 | ตรวจ task ID ก่อนส่งเข้า database | ทำ: ส่ง `PATCH /api/tasks/abc/status` → โค้ดเดิมได้: query ผิดและตอบ 500 → ที่ถูกต้องคือ: ตอบ 400 ว่า ID ไม่ถูกต้อง |

## จุดที่สงสัย

- โจทย์ระบุว่า `authenticate` จัดการ token ผิดหรือไม่มี token และตอบ 401 ให้แล้ว จึงไม่แก้ middleware
- หลังแก้เงื่อนไขสิทธิ์แล้ว ควรตรวจให้ Employee เปลี่ยนได้เฉพาะ `To Do` เป็น `Done` เท่านั้น
