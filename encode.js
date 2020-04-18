const { exec } = require('child_process');

module.exports = (url, opts = { 'max-filesize': '5m' }) => {
  const pattern = /\[ffmpeg\] Destination: (?<name>.*)\.mp3/
  return new Promise((resolve, reject) => {
    const optsFlags = Object.entries(opts)
      .map(([key, value]) => `--${key} ${value}`).join(' ');

    exec(`youtube-dl ${optsFlags} --write-thumbnail -x --audio-format mp3 ${url}`, {
      cwd: 'public'
    }, (err, result) => {
      console.log(result);
      if(err) return reject(err);
      if(result.includes('File is larger than max-filesize')) return reject('File too large. Pick something under 30 seconds.');

      const { name } = result.match(pattern).groups;
      resolve({
        name,
        mp3: encodeURI(`https://juke.alchemycodelab.io/${name}.mp3`),
        image: `https://juke.alchemycodelab.io/${name}.jpg`
      });
    });
  })
}

