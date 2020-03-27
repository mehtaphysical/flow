const mongoose = require('mongoose');
const { getStudents } = require('../services/canvas');

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

schema.statics.generateReport = async function(courseId, start, end) {
  const students = await getStudents();

  const testReport = await this
    .aggregate([
      {
        '$match': {
          createdAt: {
            $gte: start,
            $lt: end
          }
        }
      },
      {
        '$group': {
          _id: '$email',
          avgFailedSuites: { $avg: '$numFailedTestSuites' },
          avgFailedTests: { $avg: '$numFailedTests' },
          avgPassedSuites: { $avg: '$numPassedTestSuites' },
          avgPassedTests: { $avg: '$numPassedTests' },
          avgTotalTestSuites: { $avg: '$numTotalTestSuites' },
          avgTotalTests: { $avg: '$numTotalTests' }
        }
      }
    ]);

  return students.map(student => ({
    name: student.name,
    email: student.email,
    report: testReport.find(report => report._id === student.email)
  }));
};

module.exports = mongoose.model('Run', schema);
