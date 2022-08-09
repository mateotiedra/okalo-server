const controller = require('../controllers/book.controller');
const { verifyQueryParams } = require('../middlewares/request.middleware');

module.exports = function (app) {
  // Get a list of suggestion from book's attr
  app.get(
    '/book/suggestions',
    verifyQueryParams(['attr', 'match']),
    controller.getSuggestedList
  );

  // Get a list of all the books corresponding to the query
  app.get('/book/search', controller.searchBooks);

  // Get a list of all the books corresponding to the query
  app.get('/book', [verifyQueryParams(['uuid'])], controller.getBookBoard);

  // Check if the book with this isbn exists and if it does return the uuid
  app.get('/book/isbn', verifyQueryParams(['isbn']), controller.getBookByIsbn);
};
