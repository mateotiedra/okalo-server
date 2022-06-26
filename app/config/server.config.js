require('dotenv').config();

module.exports = {
  PRODUCTION: process.env.PRODUCTION === 'true',
  PORT: process.env.PORT || 8080,
  ISBN_API_URL: 'https://openlibrary.org/isbn/',
  RESET_DB: false,
};
