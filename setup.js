require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const connect = require('./lib/utils/connect');

module.exports = async() => {
  global.__MONGOD__ = mongod;
  return connect(await mongod.getUri());
};
