const mongoose = require('mongoose');
const format = require('dateformat');

const schema = new mongoose.Schema({
  reports: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    report: {
      avgFailedTestSuites: Number,
      avgFailedTests: Number,
      avgPassedTestSuites: Number,
      avgPassedTests: Number,
      avgTotalTestSuites: Number,
      avgTotalTests: Number
    }
  }]
}, { timestamps: true });

schema.virtual('missingStudents').get(function() {
  return this.reports
    .filter(report => Object.keys(report.report).length > 0)
    .map(({ name }) => name);
});

schema.virtual('title').get(function() {
  return `Report for ${format(this.createdAt, 'HH: dddd, mmmm d, yyyy')}`;
});

schema.methods.toString = function() {
  return this.reports
    .map(report => {
      return `${report.name} - ${report.email}
Failed Suites: ${report.report.avgFailedTestSuites}
Failed Tests: ${report.report.avgFailedTests}
Passed Suites: ${report.report.avgPassedTestSuites}
Passed Tests: ${report.report.avgPassedTests}
Total Suites: ${report.report.avgTotalTestSuites}
Total Tests: ${report.report.avgTotalTests}`;
    })
    .join('\n\n');
};

schema.methods.feedItem = function() {
  return {
    title: this.title,
    description: `${this.title}. Student test results.`,
    content: `<p>
${this.toString()}

${this.missingStudents.join(', ')}
</p>`,
    link: `https://jest-test-rss.herokuapp.com/api/v1/reports/${this._id}`,
    date: this.createdAt
  };
};

module.exports = mongoose.model('Report', schema);
