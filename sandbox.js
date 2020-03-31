const http = require('https');
const { parse } = require('url');
const { sign } = require('jsonwebtoken');

const now = (Date.now() / 1000) + 86400;

const token = sign({
  iss: 'zAIHpAjoRZaeirV_8WZTQw',
}, 'Y5JCbbE3wvxRH3mAYYTaiJFMudA0HfFXkQ31', {
  expiresIn: '24h'
});

console.log(token);


const req = http.request({
  ...parse('https://api.zoom.us/v2/chat/users/me/messages'),
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'User-Agent': 'Zoom-Jwt-Request'
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.write(JSON.stringify({ message: 'hello' }));
req.end();
