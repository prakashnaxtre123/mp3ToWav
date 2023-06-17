const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

app.post('/convert', upload.single('mp3File'), (req, res) => {
  const mp3FilePath = req.file.path;
  console.log(req.file)
  const wavFilePath = `converted/Z${Math.floor(Math.random()*100)}-${req.file.originalname.split('.')[0]}.wav`;

  ffmpeg(mp3FilePath)
    .toFormat('wav')
    .on('error', (err) => {
      console.error('An error occurred: ' + err.message);
      res.status(500).json({ error: 'Conversion failed' });
    })
    .on('end', () => {
      console.log('MP3 to WAV conversion complete');
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Disposition', `attachment; filename=${wavFilePath}`);
      res.download(wavFilePath, 'output.wav', (err) => {
        if (err) {
          console.error('Download error: ' + err.message);
          res.status(500).json({ error: 'Download failed' });
        }
      });
    })
    .save(wavFilePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});