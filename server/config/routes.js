const emails = require('../controllers/emails');
const path = require('path');

module.exports = (app) => {
  app.post('/email', (req, res) => {
    emails.create(req, res);
  });
};
