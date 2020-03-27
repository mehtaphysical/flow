const { Router } = require('express');
const { Feed } = require('feed');
const Report = require('../models/Report');

module.exports = Router()
  .post('/', (req, res, next) => {
    Report
      .create(req.body)
      .then(report => res.send(report))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Report
      .find()
      .then(reports => {
        const feed = new Feed({
          title: 'Tests',
          description: 'Student test report'
          link: 'https://jest-test-rss.herokuapp.com/'
        });

        reports.forEach(report => {
          feed.addItem({
            title: report.name,
            description: report.toString(),
            content: `<p>${report.toString()}</p>`,
            link: `https://jest-test-rss.herokuapp.com/api/v1/reports/${report._id}`,
            date: report.createdAt
          });
        });

        console.log(feed.rss2());

        res.send(feed.rss2());
      })
      .catch(next);
  });
