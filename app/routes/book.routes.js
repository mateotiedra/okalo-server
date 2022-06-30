const controller = require('../controllers/book.controller');
const { verifyQueryParams } = require('../middlewares/request.middleware');

module.exports = function (app) {
  // Get a list of suggestion from book's attr
  app.get('/book/suggestions', controller.getSuggestedList);

  // Get a list of all the books corresponding to the query
  app.get('/book/search', controller.searchBooks);

  // Get a list of all the books corresponding to the query
  app.get('/book', [verifyQueryParams(['uuid'])], controller.getBookBoard);
};
