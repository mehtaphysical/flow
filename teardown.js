const mongoose = require('mongoose');


module.exports = () => Promise.all([mongoose.connection.close(), global.__MONGOD__.stop()]);
