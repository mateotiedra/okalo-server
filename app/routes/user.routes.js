const {
  verifyAccessToken,
  verifyRole,
} = require('../middlewares/user.middleware');
const {
  verifyRequestBody,
  verifyQueryParams,
} = require('../middlewares/request.middleware');
const controller = require('../controllers/user.controller');
const { findUserByAttribute } = require('../middlewares/finders.middleware');

module.exports = function (app) {
  // Get the user's private infos
  app.get('/user/u', [verifyAccessToken], controller.getUserBoard);

  // Get a user basic info
  app.get('/user', [findUserByAttribute('username')], controller.getUserBoard);

  // Get all the users
  app.get(
    '/user/all',
    [verifyAccessToken, verifyRole(['mod', 'admin'])],
    controller.getEveryUserBoard
  );

  app.get('/user/best', controller.getBest);

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

  // Change user's attributes
  app.put('/user', [verifyAccessToken], controller.updateUserParameters);

  // Change user institutions
  app.put(
    '/user/institutions',
    [verifyAccessToken, verifyRequestBody(['newInstitutionIds'])],
    controller.updateUserInstitutions
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
