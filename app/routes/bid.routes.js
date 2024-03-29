const {
  verifyAccessToken,
  verifyOwnership,
} = require('../middlewares/user.middleware');
const {
  verifyRequestBody,
  verifyQueryParams,
} = require('../middlewares/request.middleware');
const { findBidByAttribute } = require('../middlewares/finders.middleware');

const controller = require('../controllers/bid.controller');
const bookController = require('../controllers/book.controller');

module.exports = function (app) {
  // Create a new bid
  app.post(
    '/bid',
    [
      verifyAccessToken,
      verifyRequestBody(['condition', 'customisation', 'price']),
    ],
    controller.newBid
  );

  // Get the bid's basics infos
  app.get('/bid', [verifyQueryParams(['uuid'])], controller.getBidBoard);

  // Change bid's attributes
  app.put(
    '/bid',
    [verifyAccessToken, findBidByAttribute('uuid'), verifyOwnership],
    controller.updateBidParameters
  );

  // Delete a bid
  app.delete(
    '/bid',
    [verifyAccessToken, findBidByAttribute('uuid'), verifyOwnership],
    controller.deleteBid
  );

  // Get a list of suggestion from book's attr
  app.get('/book/suggestions', bookController.getSuggestedList);
};
