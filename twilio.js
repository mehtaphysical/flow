const { Twilio, twiml: { VoiceResponse } } = require('twilio');
const encode = require('./encode');

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;

const twilio = new Twilio(sid, token);

const calls = {};

const endZoom = sid => {
  const hangup = new VoiceResponse();
  hangup.hangup();

  return twilio.calls
    .get(sid)
    .update({
      twiml: hangup.toString()
    });
}

const bombZoom = async(meetingId, url) => {
  const { name, mp3, image } =  await encode(url, {
    'max-filesize': '550k'
  });

  const playlist = new VoiceResponse();
  playlist.play(mp3);
  playlist.hangup();

  const { sid } = await twilio.calls.create({
    to: '+16699009128',
    from: '+16157515375',
    sendDigits: `${meetingId}#ww#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*6`,
    twiml: playlist.toString(),
    statusCallback: 'https://juke.alchemycodelab.io/status',
    record: true,
    recordingStatusCallback: 'https://juke.alchemycodelab.io/recording',
    trim: true
  });

  calls[sid] = { name, mp3, image, meetingId, complete: false };

  return { name, image, sid };
};

const completedCall = sid => {
  calls[sid] = { ...calls[sid], complete: true }
};

const completedRecording = (sid, recording) => {
  calls[sid] = { ...calls[sid], recording };
}

const callStatus = sid => {
  return calls[sid];
};

module.exports = {
  endZoom,
  bombZoom,
  completedCall,
  completedRecording,
  callStatus
}
