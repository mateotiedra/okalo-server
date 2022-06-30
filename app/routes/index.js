// routes
module.exports = function (app) {
  require('./auth.routes')(app);
  require('./user.routes')(app);
  require('./bid.routes')(app);
  require('./book.routes')(app);
  require('./institution.routes')(app);
};
