# 📥 YouTube MP3 & MP4 Downloader

A simple and easy-to-use web application for downloading YouTube videos as MP4 or converting them to MP3 audio. This project is built with Node.js, Express, and utilizes `@distube/ytdl-core` for interacting with YouTube and `FFmpeg` for audio conversion.

---

โปรเจกต์เว็บแอปพลิเคชันสำหรับดาวน์โหลดวิดีโอ YouTube เป็นไฟล์ MP4 หรือแปลงเป็นไฟล์เสียง MP3 ที่ใช้งานง่าย สร้างขึ้นด้วย Node.js, Express โดยใช้ `@distube/ytdl-core` ในการดึงข้อมูลจาก YouTube และใช้ `FFmpeg` สำหรับการแปลงไฟล์เสียง

## 🎨 Features / ฟีเจอร์

- **Easy Interface:** Just paste a YouTube URL and click "Convert".
- **Multiple Formats:** Displays a list of available video qualities (720p, 360p, etc.) and an option for MP3 audio.
- **Dynamic Results:** Fetches video title and thumbnail to show you what you're downloading.
- **Direct Download:** Download files directly from your browser.

---

- **หน้าตาใช้งานง่าย:** เพียงวางลิงก์ YouTube ที่ต้องการแล้วกดปุ่ม "Convert"
- **รองรับหลายรูปแบบ:** แสดงรายการคุณภาพวิดีโอให้เลือกดาวน์โหลด (เช่น 720p, 360p) พร้อมตัวเลือกสำหรับไฟล์เสียง MP3
- **แสดงผลลัพธ์แบบไดนามิก:** ดึงชื่อและภาพปกของวิดีโอมาแสดงเพื่อให้แน่ใจว่าคุณกำลังโหลดไฟล์ที่ถูกต้อง
- **ดาวน์โหลดได้โดยตรง:** สามารถดาวน์โหลดไฟล์ผ่านเบราว์เซอร์ได้ทันที

## 🛠️ Tech Stack / เทคโนโลยีที่ใช้

- **Backend:** Node.js, Express.js
- **YouTube Interaction:** `@distube/ytdl-core`
- **Audio Conversion:** FFmpeg, `fluent-ffmpeg`
- **Frontend:** HTML, Tailwind CSS
- **Template Engine:** EJS

## 🚀 Getting Started / การติดตั้งและใช้งาน

Follow these instructions to get a copy of the project up and running on your local machine.
ทำตามขั้นตอนต่อไปนี้เพื่อติดตั้งและรันโปรเจกต์บนเครื่องคอมพิวเตอร์ของคุณ

### Prerequisites / สิ่งที่ต้องมี

- [Node.js](https://nodejs.org/) (which includes npm)

### Installation / ขั้นตอนการติดตั้ง

1.  **Clone the repository (or download the source code):**
    **โคลนโปรเจกต์ (หรือดาวน์โหลดซอร์สโค้ด):**
    ```bash
    git clone https://github.com/YourUsername/youtube-downloader.git
    cd youtube-downloader
    ```
    *(Replace `YourUsername` with your actual GitHub username.)*
    *(อย่าลืมเปลี่ยน `YourUsername` ให้เป็นชื่อผู้ใช้ GitHub ของคุณ)*

2.  **Install NPM packages:**
    **ติดตั้งแพ็กเกจที่จำเป็น:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    **รันแอปพลิเคชัน:**
    ```bash
    node server.js
    ```

4.  Open your browser and navigate to `http://localhost:3000`.
    เปิดเบราว์เซอร์แล้วเข้าไปที่ `http://localhost:3000`

## 📝 How It Works / หลักการทำงาน

1.  A user pastes a YouTube URL on the main page and submits the form to the `/convert` endpoint.
2.  The server receives the URL, uses `ytdl.getInfo()` to fetch video details and a list of available formats.
3.  The server then renders the `results.ejs` template, passing the video data to it. This page displays the video thumbnail, title, and a table of download links.
4.  Each download link points to the `/download` endpoint with the video ID and format `itag` as query parameters.
5.  When a user clicks a download link, the server receives the request, sets the appropriate `Content-Disposition` header, and pipes the video/audio stream from `ytdl-core` (and `FFmpeg` for MP3) to the user's browser, initiating the download.

## ⚠️ Disclaimer / ข้อจำกัดความรับผิดชอบ

This project is for educational purposes only. Please respect copyright laws and the terms of service of YouTube. Do not download copyrighted material without permission.

โปรเจกต์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น โปรดเคารพกฎหมายลิขสิทธิ์และข้อตกลงในการให้บริการของ YouTube ห้ามดาวน์โหลดเนื้อหาที่มีลิขสิทธิ์โดยไม่ได้รับอนุญาต
