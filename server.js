const express = require('express');
const ytdl = require('@distube/ytdl-core');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่า Template Engine และ Static Files
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
    return res.status(400).send('Invalid YouTube URL.');
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const videoId = ytdl.getVideoID(videoURL);

  
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const usefulFormats = formats
      .filter(f => f.qualityLabel && (f.container === 'mp4' || f.container === 'webm'))
      .map(f => ({
        itag: f.itag,
        qualityLabel: f.qualityLabel,
        container: f.container,
      }));

   
    usefulFormats.push({
      itag: 'mp3',
      qualityLabel: '128kbps',
      container: 'mp3',
    });

   
    res.render('results', {
      videoTitle: info.videoDetails.title,
      thumbnailUrl: info.videoDetails.thumbnails.pop().url, 
      formats: usefulFormats,
      videoId: videoId,
    });

  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).send('Could not get video info. It might be private or deleted.');
  }
});


app.get('/download', async (req, res) => {
  const videoId = req.query.id;
  const itag = req.query.itag;
  const container = req.query.container;
  const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s.-]/g, '').trim() || 'video';
   
    const filename = `${title}.${container}`;
    res.header('Content-Disposition', `attachment; filename="${filename}"`);

    if (itag === 'mp3') {
   
      const audioStream = ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' });
      ffmpeg(audioStream)
        .audioBitrate(128)
        .format('mp3')
        .on('error', (err) => console.error('FFmpeg Error:', err.message))
        .pipe(res, { end: true });
    } else {
      ytdl(videoURL, { quality: itag }).pipe(res);
    }

  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).send('Failed to download the file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});