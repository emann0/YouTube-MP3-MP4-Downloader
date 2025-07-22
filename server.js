
require('dotenv').config();

const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ejs = require('ejs');
const { HttpsProxyAgent } = require('https-proxy-agent');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = process.env.PORT || 3000;

const proxy = process.env.PROXY;

let ytdlRequestOptions = {}; 
if (proxy) {
  console.log('Proxy กำลังทำงาน...');
  const agent = new HttpsProxyAgent(proxy);
  ytdlRequestOptions = { client: agent }; 
} else {
  console.log('ไม่ได้ใช้ Proxy, กำลังยิงตรง...');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/convert', async (req, res) => {
  const videoURL = req.body.url;
  
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).render('error', { message: 'ลิงก์ YouTube ไม่ถูกต้อง! เช็คดีๆ ก่อน' });
  }

  try {
    // << กูแก้ตรงนี้! ส่ง options ที่มี client เข้าไป
    const info = await ytdl.getInfo(videoURL, { requestOptions: ytdlRequestOptions });
    const videoId = ytdl.getVideoID(videoURL);

    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const usefulFormats = formats
      .filter(f => f.qualityLabel && (f.container === 'mp4' || f.container === 'webm'))
      .map(f => ({ itag: f.itag, qualityLabel: f.qualityLabel, container: f.container }));

    usefulFormats.push({ itag: 'mp3', qualityLabel: '128kbps', container: 'mp3' });

    res.render('results', {
      videoTitle: info.videoDetails.title,
      thumbnailUrl: info.videoDetails.thumbnails.pop().url, 
      formats: usefulFormats,
      videoId: videoId,
    });

  } catch (error) {
    console.error('Error fetching video info:', error.message);
    res.status(500).render('error', { message: `หาวิดีโอไม่เจอ หรือ Proxy เน่า (Error: ${error.message})` });
  }
});

app.get('/download', async (req, res) => {
  const videoId = req.query.id;
  const itag = req.query.itag;
  const container = req.query.container;
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(videoURL, { requestOptions: ytdlRequestOptions });
    const title = info.videoDetails.title.replace(/[^\w\s.-]/g, '').trim() || 'video';
    const filename = `${title}.${container}`;
    res.header('Content-Disposition', `attachment; filename="${filename}"`);

    const downloadOptions = { quality: itag, requestOptions: ytdlRequestOptions }; 

    if (itag === 'mp3') {
      const audioStreamOptions = { filter: 'audioonly', quality: 'highestaudio', requestOptions: ytdlRequestOptions }; 
      const audioStream = ytdl(videoURL, audioStreamOptions);
      ffmpeg(audioStream)
        .audioBitrate(128)
        .format('mp3')
        .on('error', (err) => console.error('FFmpeg Error:', err.message))
        .pipe(res, { end: true });
    } else {
      ytdl(videoURL, downloadOptions).pipe(res);
    }
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).send('Failed to download the file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});