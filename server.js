const express = require('express');
const app = express();
const { callZoom, zoomOrchestrate, endZoom } = require('./twilio');

app.use(express.json());
app.use(express.static('./public'))

const defaultSong = 'https://t4.bcbits.com/stream/b7e07f1271193e70864115e5917d3963/mp3-128/1068935279?p=0&ts=1585929229&t=b6d1290fe8d7f498ccf04f66d22853950b70c22a&token=1585929229_21ebfa57053ebe4d75fc1272a18c33bb0b6b1c99';
const songs = [];

app.post('/start', (req, res) => {
  callZoom(req.body.meetingId, zoomOrchestrate(songs.pop() || defaultSong))
    .then(call => res.send(call));
});

app.post('/stop', (req, res) => {
  endZoom(req.body.meetingId)
    .then(call => res.send(call));
});

app.post('/songs', (req, res) => {
  songs.unshift(req.body.song);
  res.status(204).end();
});

app.get('/songs', (req, res) => {
  res.send(songs);
});

app.get('/next', (req, res) => {
  res.send(zoomOrchestrate(songs.pop() || defaultSong));
});

app.listen(process.env.PORT || 7890);
