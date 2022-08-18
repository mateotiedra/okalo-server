require('dotenv').config();

const production = process.env.PRODUCTION == 'true';

module.exports = {
  PRODUCTION: production,
  PORT: process.env.PORT || 8080,
  ISBN_API_URL: 'https://www.googleapis.com/books/v1/volumes?q=isbn:',
  // 'https://openlibrary.org/api/books?jscmd=data&format=json&bibkeys=ISBN:',
  RESET_DB: !production && true,
};
