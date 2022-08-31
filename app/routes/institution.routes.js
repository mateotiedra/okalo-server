const controller = require('../controllers/institution.controller');
const { verifyQueryParams } = require('../middlewares/request.middleware');

module.exports = function (app) {
  // Get a list of suggestion from name
  app.get('/institution/suggestions', controller.getSuggestedList);

  // Get the top
  app.get('/institution/best', controller.getBest);
};
