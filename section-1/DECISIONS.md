# Decision Log

## D1: จะเก็บ session ของผู้ใช้ที่ login ไว้ที่ไหน (Section 3)
- ทางเลือกที่คิดไว้: (A) React Context และ `localStorage` (B) Redux (C) ส่ง user/token ผ่าน props
- เลือก: A
- เพราะ: มี state ร่วมเพียง user และ token; Context ทำให้ Route Guard และทุกหน้าตรวจ role ได้โดยไม่เพิ่ม state-management dependency และ `localStorage` ช่วยคง session mock หลัง refresh
- ข้อเสียของ A ที่ยอมรับ: `localStorage` ไม่เหมาะกับ token จริงที่มีความอ่อนไหว และ Context ไม่เหมาะเมื่อ state ซับซ้อนหรือมีการเปลี่ยนแปลงถี่; ระบบจริงควรใช้ session ที่ปลอดภัยจาก backend

## D2: จะจำลอง API อย่างไรโดยไม่มี backend (Section 3)
- ทางเลือกที่คิดไว้: (A) เรียกฟังก์ชันที่แก้ state ตรงจาก component (B) แยก service ที่คืน Promise และตรวจสิทธิ์ (C) เพิ่ม backend จริง
- เลือก: B
- เพราะ: ทำให้ UI ใช้รูปแบบ asynchronous เหมือนเรียก server, ทดสอบ loading/error ได้ และรวมกฎ authorization กับ audit log ไว้ในจุดเดียว
- ข้อเสียของ B ที่ยอมรับ: ข้อมูลอยู่ใน memory จึง reset เมื่อ reload และไม่ใช่การป้องกัน security จริง; backend จริงต้องตรวจสิทธิ์ซ้ำทุก request

## D3: จะจัดเก็บสถานะและ audit log ในฐานข้อมูลอย่างไร (Section 2)
- ทางเลือกที่คิดไว้: (A) เก็บสถานะเป็นข้อความโดยไม่จำกัดค่า (B) ใช้ `CHECK` จำกัดสถานะและตาราง audit แยก (C) เก็บ audit เป็น JSON ในแถว task
- เลือก: B
- เพราะ: `CHECK` ป้องกันสถานะนอกกติกาที่ระดับฐานข้อมูล และ audit แยกหนึ่งแถวต่อการเปลี่ยนสถานะ ทำให้ตรวจสอบย้อนหลังและ query ได้ตรงไปตรงมา
- ข้อเสียของ B ที่ยอมรับ: การเพิ่มสถานะใหม่ต้องแก้ constraint และ migration; audit ที่อ้างถึง task ซึ่งถูกลบจะคง record โดยตั้ง `task_id` เป็น `NULL`

## D4: จะบังคับสิทธิ์เข้าหน้าและสิทธิ์แก้ข้อมูลที่ชั้นใด (Section 3)
- ทางเลือกที่คิดไว้: (A) ซ่อนปุ่มใน UI (B) Route Guard และตรวจสิทธิ์ใน Mock API (C) ตรวจเฉพาะตอน login
- เลือก: B
- เพราะ: Route Guard ให้ UX ที่เข้าใจง่าย ส่วนการตรวจซ้ำใน service ป้องกันการเรียก action โดยตรงจาก component; ระบบจริงต้องย้ายการบังคับใช้ไป backend ด้วย
- ข้อเสียของ B ที่ยอมรับ: client-side guard ไม่ใช่ security boundary และ role ใน mock client แก้ไขได้

## D5: จะอัปเดตหน้า Employee หลังเปลี่ยนสถานะอย่างไร (Section 3)
- ทางเลือกที่คิดไว้: (A) optimistic update แล้ว rollback หาก API ล้มเหลว (B) รอ response ที่สำเร็จแล้วใช้ข้อมูลที่ server คืนมา (C) รอ polling รอบถัดไป
- เลือก: B
- เพราะ: หน้าจอแสดงสถานะที่ server ยืนยันแล้วเท่านั้น จึงไม่แสดง Done หากบันทึกไม่สำเร็จ และไม่ต้องจัดการ rollback state ซับซ้อน
- ข้อเสียของ B ที่ยอมรับ: การเปลี่ยนหน้าจอช้าตาม latency ของ API; ใน mock ใช้ delay สั้นและ disable ปุ่มระหว่างบันทึก

## การใช้ AI

ใช้ AI ช่วยร่างทางเลือกการออกแบบ, โครงสร้างไฟล์ และตรวจความครบถ้วนของ business rules
ผู้จัดทำควรทบทวนและอธิบายเหตุผลรวมถึงข้อจำกัดของทุกส่วนได้ด้วยตนเอง
