require('dotenv').config();

module.exports = {
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL,
  DIALECT: 'mysql',
  POOL: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
