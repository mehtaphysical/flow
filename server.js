require('dotenv').config();

const express = require('express');
const app = express();
const {
  callZoom,
  endZoom,
  bombZoom,
  zoomOrchestrate,
  addSong,
  getSongs
} = require('./twilio');

app.use(require('cors')());
app.use(express.json());
app.use(express.static('./public'))

const normalizeMeetingId = meetingId => meetingId.replace(/-/g, '');

app.post('/events', (req, res) => {
  const event = req.body.event;
  const meetingId = req.body.payload.object.id;
  console.log(event, meetingId);

  if(meetingId == '296775701' || meetingId == '119978303') { 
    if(event === 'recording.resumed') {
      endZoom(meetingId)
        .then(call => res.send(call));
    }

    if(event === 'recording.paused') {
      callZoom(meetingId)
      .then(call => res.send(call));
    }
  }

  res.status(204).end();
})

app.post('/start', (req, res) => {
  callZoom(normalizeMeetingId(req.body.meetingId))
    .then(call => res.send(call));
});

app.post('/stop', (req, res) => {
  endZoom(normalizeMeetingId(req.body.meetingId))
    .then(call => res.send(call));
});

app.post('/bomb', (req, res) => {
  bombZoom(normalizeMeetingId(req.body.meetingId))
    .then(call => res.send(call));
});

app.post('/songs/:meetingId', (req, res) => {
  addSong(normalizeMeetingId(req.params.meetingId), req.body.song)
    .then(() => res.status(204).end());
});

app.get('/songs/:meetingId', (req, res) => {
  res.send(getSongs(normalizeMeetingId(req.params.meetingId)));
});

app.post('/next/:meetingId', (req, res) => {
  res
    .contentType('text/xml')
    .send(zoomOrchestrate(normalizeMeetingId(req.params.meetingId)));
});

app.post('/upload/:meetingId', require('./storage'), (req, res) => {
  addSong(normalizeMeetingId(req.params.meetingId), `https://jest-test-rss.herokuapp.com/${req.file.filename}`);
  res.status(204).end();
});

app.listen(process.env.PORT || 7890);
