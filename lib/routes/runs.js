const { Router } = require('express');
const Run = require('../models/Run');

module.exports = Router()
  .post('/', (req, res, next) => {
    Run
      .create(req.body)
      .then(run => res.send(run))
      .catch(next);
  });
