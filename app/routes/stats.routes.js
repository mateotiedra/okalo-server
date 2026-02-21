const controller = require('../controllers/stats.controller');

module.exports = function (app) {
  // Get home page statistics (user, book, bid, institution counts)
  app.get('/stats/home', controller.getHomeStats);
};
