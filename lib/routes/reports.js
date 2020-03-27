const { Router } = require('express');
const { Feed } = require('feed');
const Run = require('../models/Run');
const Report = require('../models/Report');

module.exports = Router()
  .post('/', (req, res, next) => {
    return Run
      .generateReport(req.body.start, req.body.end)
      .then(report => res.send(report))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Report
      .find()
      .then(reports => {
        const feed = new Feed({
          title: 'Tests',
          description: 'Student test report',
          link: 'https://jest-test-rss.herokuapp.com/'
        });

        reports.forEach(report => {
          feed.addItem(report.feedItem());
        });
        res.send(feed.rss2());
      })
      .catch(next);
  });
