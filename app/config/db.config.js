require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const config = require('./server.config.js');

module.exports = {
  DB_CONNECTION_URL: config.PRODUCTION
    ? process.env.JAWSDB_URL
    : process.env.DEVDB_URL,
  DIALECT: 'mysql',
  POOL: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
