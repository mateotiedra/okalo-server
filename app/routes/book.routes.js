const controller = require('../controllers/book.controller');

module.exports = function (app) {
  // Get a list of suggestion from book's attr
  app.get('/book/suggestions', controller.getSuggestedList);
};
