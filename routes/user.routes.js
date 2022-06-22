const {
  verifyAccessToken,
  verifyRole,
} = require('../middlewares/user.middleware');
const { verifyRequestBody } = require('../middlewares/request.middleware');
const controller = require('../controllers/user.controller');
const { findUserByAttribute } = require('../middlewares/finders.middleware');

module.exports = function (app) {
  // Get the user's basics infos
  app.get('/user/u', [verifyAccessToken], controller.getUserBoard);

  // Get all the users
  app.get(
    '/user/all',
    [verifyAccessToken, verifyRole(['mod', 'admin'])],
    controller.getEveryUserBoard
  );

  // Change the user role
  app.put(
    '/user/update/role',
    [
      verifyRequestBody(['userEmail', 'newRole']),
      verifyAccessToken,
      verifyRole(['admin']),
      findUserByAttribute('email', 'userEmail'),
    ],
    controller.updateUserRole
  );

  // Delete a user account
  app.delete(
    '/user',
    [
      verifyRequestBody(['userEmail']),
      verifyAccessToken,
      verifyRole(['admin']),
      findUserByAttribute('email', 'userEmail'),
    ],
    controller.deleteUser
  );
};
