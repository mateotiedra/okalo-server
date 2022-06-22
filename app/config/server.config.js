require('dotenv').config();

module.exports = {
  PRODUCTION: process.env.PRODUCTION === 'true',
  PORT: process.env.PORT || 8080,
};
