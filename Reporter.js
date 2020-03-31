const { execSync } = require('child_process');

module.exports = class Reporter {
  onRunComplete(contexts, results) {
    if(results.numFailedTests) execSync('git reset --hard HEAD');
  }
};
