const {
  verifyAccessToken,
  verifyOwnership,
} = require('../middlewares/user.middleware');
const { verifyRequestBody } = require('../middlewares/request.middleware');
const controller = require('../controllers/bid.controller');
const { findBidByAttribute } = require('../middlewares/finders.middleware');

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
  app.get('/bid', [findBidByAttribute('uuid')], controller.getBidBoard);

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
};
