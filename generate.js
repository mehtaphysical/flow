require('dotenv').config();
require('./lib/utils/connect')();

const mongoose = require('mongoose');
const Run = require('./lib/models/Run');
const Report = require('./lib/models/Report');

const end = new Date();
end.setMinutes(0);
end.setSeconds(0);
const start = new Date(end);
start.setHours(start.getHours() - 1);

Run
  .generateReport('1838055', start, end)
  .then(reports => Report.create({ reports }))
  .then(console.log)
  .finally(() => mongoose.connection.close());
