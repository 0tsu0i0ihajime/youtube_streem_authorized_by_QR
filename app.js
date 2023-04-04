const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');

let qrCodeRead = false;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'QRReader-min.html'));
});

app.post('/data', (req, res) => {
  const qrCodeData = req.body.input;
  const validQRCodeData = "04afahfakjfvizovhsoigeewpUwr326";
  
  if(qrCodeData === validQRCodeData){
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);//1年間有効なCookieを設定
    res.cookie("authToken", "validToken", {expires: expires});
    res.redirect(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.send("Invalid QR Code Data");
  }
});

app.get('/stream', async(req, res) => {
  const videoUrl = req.query.videoUrl;
  const audioStream = ytdl(videoUrl, {filter: 'audioonly'});
  
  audioStream.pipe(res);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on port ${process.env.PORT || 8080}`);
})
