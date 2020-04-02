const { Twilio, twiml: { VoiceResponse } } = require('twilio');

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;

const twilio = new Twilio(sid, token);

const defaultSong = 'https://t4.bcbits.com/stream/b7e07f1271193e70864115e5917d3963/mp3-128/1068935279?p=0&ts=1585929229&t=b6d1290fe8d7f498ccf04f66d22853950b70c22a&token=1585929229_21ebfa57053ebe4d75fc1272a18c33bb0b6b1c99';
const calls = {}

const callZoom = (meetingId, twiml) => {
  return twilio.calls.create({
    to: '+16699009128',
    from: '+16157515375',
    sendDigits: `${meetingId}#ww#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*6`,
    twiml
  })
    .then(call => {
      calls[meetingId] = { sid: call.sid, songs: [] };
      return call;
    })
};

const endZoom = meetingId => {
  const hangup = new VoiceResponse();
  hangup.hangup();

  return twilio.calls
    .get(calls[meetingId].sid)
    .update({
      twiml: hangup.toString()
    });
}

const zoomOrchestrate = meetingId => {
  const play = new VoiceResponse();
  play.play(calls[meetingId].songs.pop() || defaultSong);
  play.redirect(`https://jest-test-rss.herokuapp.com/next/${meetingId}`);

  return play.toString();
}

const addSong = (meetingId, song) => {
  calls[meetingId].songs.unshift(song);
}

const getSongs = meetingId => calls[meetingId].songs;

module.exports = {
  callZoom,
  endZoom,
  addSong,
  getSongs,
  zoomOrchestrate
}
