const { Twilio, twiml: { VoiceResponse } } = require('twilio');

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;

const twilio = new Twilio(sid, token);

const defaultSong = 'https://jest-test-rss.herokuapp.com/child.mp3';
const calls = {};
const jukeBox = {};

const callZoom = meetingId => {
  return twilio.calls.create({
    to: '+16699009128',
    from: '+16157515375',
    sendDigits: `${meetingId}#ww#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*6`,
    twiml: zoomOrchestrate(meetingId)
  })
    .then(call => {
      calls[meetingId] = call.sid;
      return call;
    })
};

const endZoom = meetingId => {
  const hangup = new VoiceResponse();
  hangup.hangup();

  return twilio.calls
    .get(calls[meetingId])
    .update({
      twiml: hangup.toString()
    });
}

const zoomOrchestrate = meetingId => {
  const play = new VoiceResponse();
  play.play((jukeBox[meetingId] || []).shift() || defaultSong);
  play.redirect(`https://jest-test-rss.herokuapp.com/next/${meetingId}`);

  return play.toString();
}

const addSong = (meetingId, song) => {
  if(!jukeBox[meetingId]) jukeBox[meetingId] = [];
  jukeBox[meetingId].push(song);
}

const getSongs = meetingId => jukeBox[meetingId] || [];

module.exports = {
  callZoom,
  endZoom,
  addSong,
  getSongs,
  zoomOrchestrate
}
