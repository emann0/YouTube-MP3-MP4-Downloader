# ใช้ Node.js เวอร์ชัน 18 เป็นพื้นฐาน
FROM node:18-slim

# ตั้งค่า Working Directory ภายใน Container
WORKDIR /app

# อัปเดตและติดตั้ง FFmpeg (นี่คือหัวใจสำคัญ)
RUN apt-get update && apt-get install -y ffmpeg

# คัดลอก package.json และ package-lock.json เข้าไปก่อน
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมดที่เหลือเข้าไป
COPY . .

# บอกให้โลกรู้ว่าแอปของเราทำงานที่ Port ไหน
# (Render จะจัดการ Port ให้เอง แต่ใส่ไว้เป็นมาตรฐานที่ดี)
EXPOSE 10000

# คำสั่งสำหรับรันแอปพลิเคชัน
CMD [ "npm", "start" ]