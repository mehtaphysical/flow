require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  

  it('passes!', () => {
    expect(global.HELLO).toBe(true);
  });

  it('another', () => {
    expect(false).toBeTruthy();
  });
});
