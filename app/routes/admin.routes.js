const bookController = require('../controllers/book.controller');
const {
  verifyAccessToken,
  verifyRole,
} = require('../middlewares/user.middleware');
const { verifyQueryParams } = require('../middlewares/request.middleware');

module.exports = function (app) {
  // Get a list of suggestion from book's attr
  app.delete(
    '/admin/clean/books/isbn',
    [verifyAccessToken, verifyRole('admin')],
    bookController.cleanNoISBNBooks
  );
};
