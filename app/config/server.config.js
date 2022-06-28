require('dotenv').config();

module.exports = {
  PRODUCTION: process.env.PRODUCTION === 'true',
  PORT: process.env.PORT || 8080,
  ISBN_API_URL: 'https://www.googleapis.com/books/v1/volumes?q=isbn:',
  // 'https://openlibrary.org/api/books?jscmd=data&format=json&bibkeys=ISBN:',
  RESET_DB: false,
};
