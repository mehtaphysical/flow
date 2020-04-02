const express = require('express');
const app = express();
const {
  callZoom,
  zoomOrchestrate,
  endZoom,
  addSong,
  getSongs
} = require('./twilio');

app.use(require('cors')());
app.use(express.json());
app.use(express.static('./public'))

app.post('/events', (req, res) => {
  const event = req.body.event;
  const meetingId = req.body.payload.object.id;
  console.log(event, meetingId);
  if(meetingId === '296775701' || meetingId === '119978303') { 
    if(event === 'recording.started' || event === 'recording.resumed') {
      callZoom(meetingId)
        .then(call => res.send(call));
    }

    if(event === 'recording.stopped' || event === 'recording.paused') {
      endZoom(meetingId)
      .then(call => res.send(call));
    }
  }

  res.status(204).end();
})

app.post('/start', (req, res) => {
  callZoom(req.body.meetingId)
    .then(call => res.send(call));
});

app.post('/stop', (req, res) => {
  endZoom(req.body.meetingId)
    .then(call => res.send(call));
});

app.post('/songs/:meetingId', (req, res) => {
  addSong(req.params.meetingId, req.body.song);
  res.status(204).end();
});

app.get('/songs/:meetingId', (req, res) => {
  res.send(getSongs(req.params.meetingId));
});

app.post('/next/:meetingId', (req, res) => {
  res
    .contentType('text/xml')
    .send(zoomOrchestrate(req.params.meetingId));
});

app.listen(process.env.PORT || 7890);
