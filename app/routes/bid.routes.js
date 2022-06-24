const {
  verifyAccessToken,
  verifyRole,
} = require('../middlewares/user.middleware');
const { verifyRequestBody } = require('../middlewares/request.middleware');
const controller = require('../controllers/bid.controller');
const { findBookByISBN } = require('../middlewares/finders.middleware');

module.exports = function (app) {
  // Create a new bid
  app.post('/bid', [verifyAccessToken, findBookByISBN], controller.newBid);

  // Get the bid's basics infos
  app.get('/bid', [verifyAccessToken], controller.getBidBoard);

  /* // Change bid's attributes
  app.put('/bid', [verifyAccessToken], controller.updateUserParameters);

  // Delete a bid
  app.delete(
    '/bid',
    [
      verifyRequestBody(['userEmail']),
      verifyAccessToken,
      verifyRole(['admin']),
      findUserByAttribute('email', 'userEmail'),
    ],
    controller.deleteBid
  ); */
};
