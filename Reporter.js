const { execSync } = require('child_process');

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    console.log(results);

  }
};
