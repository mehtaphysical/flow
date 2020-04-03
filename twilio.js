const { exec } = require('child_process');
const { Twilio, twiml: { VoiceResponse } } = require('twilio');

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;

const twilio = new Twilio(sid, token);

const defaultSong = 'https://jest-test-rss.herokuapp.com/child.mp3';
const calls = {};
const jukeBox = new Proxy({}, {
  get(target, prop) {
    if(!target[prop]) target[prop] = [];
    return target[prop];
  }
});

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

const bombZoom = meetingId => {
  const playlist = new VoiceResponse();
  jukeBox[meetingId].forEach(song => {
    playlist.play(song);
  });
  playlist.hangup();
  jukeBox[meetingId] = [];

  return twilio.calls.create({
    to: '+16699009128',
    from: '+16157515375',
    sendDigits: `${meetingId}#ww#wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww*6`,
    twiml: playlist.toString()
  })
    .then(call => {
      calls[meetingId] = call.sid;
      return call;
    })
}

const zoomOrchestrate = meetingId => {
  const play = new VoiceResponse();
  play.play(jukeBox[meetingId].shift() || defaultSong);
  play.redirect(`https://jest-test-rss.herokuapp.com/next/${meetingId}`);

  return play.toString();
}

const addSong = (meetingId, song) => {
  const pattern = /\[ffmpeg\] Destination: (?<name>.*)\.mp3/
  return new Promise((resolve, reject) => {
    exec(`youtube-dl --write-thumbnail -x --audio-format mp3 ${song}`, {
      cwd: 'public'
    }, (err, result) => {
      const { name } = result.match(pattern).groups;
      jukeBox[meetingId].push(`http://167.172.206.21:7890/${name}.mp3`);
      resolve();
    });
  })
}

const getSongs = meetingId => jukeBox[meetingId] || [];

module.exports = {
  callZoom,
  endZoom,
  bombZoom,
  addSong,
  getSongs,
  zoomOrchestrate
}
