const { execSync } = require('child_process');
const request = require('superagent');

module.exports = class Reporter {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  onRunComplete(contexts, results) {
    const name = execSync('git config --get user.name', { encoding: 'utf8' }).trim();
    const email = execSync('git config --get user.email', { encoding: 'utf8' }).trim();
    request
      .post('https://jest-test-rss.herokuapp.com/api/v1/runs')
      .send({
        ...results,
        name,
        email
      })
      .end();
  }
};
