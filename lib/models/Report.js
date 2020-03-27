const mongoose = require('mongoose');

const RequiredNumber = {
  type: Number,
  required: true
};

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  numFailedTestSuites: RequiredNumber,
  numFailedTests: RequiredNumber,
  numPassedTestSuites: RequiredNumber,
  numPassedTests: RequiredNumber,
  numTotalTestSuites: RequiredNumber,
  numTotalTests: RequiredNumber
}, { timestamps: true });

schema.methods.toString = function() {
  return `${this.name} - ${this.email}
Failed Suites: ${this.numFailedTestSuites}
Failed Tests: ${this.numFailedTests}
Passed Suites: ${this.numPassedTestSuites}
Passed Tests: ${this.numPassedTests}
Total Suites: ${this.numTotalTestSuites}
Total Tests: ${this.numTotalTests}`;
};

module.exports = mongoose.model('Report', schema);
