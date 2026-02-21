// routes
module.exports = function (app) {
  require('./auth.routes')(app);
  require('./user.routes')(app);
  require('./bid.routes')(app);
  require('./book.routes')(app);
  require('./institution.routes')(app);
  require('./admin.routes')(app);
  require('./stats.routes')(app);
};
