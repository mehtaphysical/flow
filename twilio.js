const { Twilio, twiml: { VoiceResponse } } = require('twilio');

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;

const twilio = new Twilio(sid, token);

const callZoom = meetingId => {
  return twilio.calls.create({
    to: '+16699009128',
    from: '+16157515375',
    sendDigits: `${meetingId}#ww#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*6`,
    twiml: play.toString()
  });
}

const zoomOrchestrate = song => {
  const play = new VoiceResponse();
  play.play(songs.pop() || defaultSong);
  play.redirect('https://jest-test-rss.herokuapp.com/next');

  return play.toString();
}

module.exports = {
  callZoom,
  zoomOrchestrate
}
