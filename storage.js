const path = require('path');
const { v4: uuid } = require('uuid');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'public',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  }
})

module.exports = multer({ storage }).single('song');
