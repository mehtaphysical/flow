require('dotenv').config();

const express = require('express');
const app = express();
const {
  endZoom,
  bombZoom,
  completedCall,
  completedRecording,
  callStatus
} = require('./twilio');

app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

const normalizeMeetingId = meetingId => meetingId.replace(/-/g, '');

app.post('/stop', (req, res, next) => {
  endZoom(normalizeMeetingId(req.body.meetingId))
    .then(call => res.send(call))
    .catch(next);
});

app.post('/bomb', (req, res, next) => {
  bombZoom(normalizeMeetingId(req.body.meetingId), req.body.song)
    .then(zoomInfo => res.send(zoomInfo))
    .catch(next);
});

app.get('/bomb/:sid', (req, res) => {
  res.send(callStatus(req.params.sid));
});

app.post('/status', (req, res, next) => {
  completedCall(req.body.CallSid);
  res.end();
});

app.post('/recording', (req, res) => {
  completedRecording(req.body.CallSid, req.body.RecordingUrl);
  res.end();
});

app.use((err, req, res, next) => {
  res.status(400).send({
    message: err
  });
});

app.listen(process.env.PORT || 7890);
