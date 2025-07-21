# ใช้ Node.js image รุ่น 18 แบบเบาๆ
FROM node:18-slim

# ติดตั้ง FFmpeg ที่แม่งเป็นปัญหาชีวิต
RUN apt-get update && apt-get install -y ffmpeg

# สร้างโฟลเดอร์สำหรับแอป
WORKDIR /usr/src/app

# ก๊อปไฟล์ package.json และ package-lock.json เข้าไปก่อน
# เพื่อใช้ cache ของ Docker ตอนลง dependency จะได้เร็วขึ้นถ้าไฟล์นี้ไม่เปลี่ยน
COPY package*.json ./

# ลง dependency ทั้งหมด
RUN npm install

# ก๊อปโค้ดทั้งหมดของมึงเข้าไป
COPY . .

# บอก Docker ว่าแอปมึงจะรันบน port 3000
EXPOSE 3000

# คำสั่งสำหรับรันแอปของมึง
CMD [ "node", "server.js" ]