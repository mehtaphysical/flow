require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

describe('app routes', () => {
  beforeAll(async() => {
    connect(await mongod.getUri());
    return mongod.start();
  });

  beforeEach(() => {
    // return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  afterAll(() => {
    return mongod.stop();
  });

  it('passes!', () => {
    expect(true).toBe(true);
  });

  it('another', () => {
    expect(false).toBeTruthy();
  });
});
