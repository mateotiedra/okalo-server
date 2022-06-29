const axios = require('axios');
const config = require('../config/server.config');

const db = require('../models/db.model');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Book = db.book;

const fetchBookData = (isbn) =>
  new Promise((resolve, reject) => {
    Book.findOne({
      where: {
        isbn: isbn,
      },
    }).then((savedBook) => {
      if (savedBook) return resolve(savedBook.uuid);
      else {
        // Fetch data from an outside api
        axios
          .get(config.ISBN_API_URL + isbn)
          .then(function ({ data, ...res }) {
            if (
              !(
                data &&
                data.items &&
                data.items.length &&
                data.items[0].volumeInfo
              )
            )
              return reject();

            data = data.items[0].volumeInfo;
            Book.create({
              isbn: isbn,
              title: data.title,
              author: data.authors && data.authors.length && data.authors[0],
              publisher: data.publisher,
              coverLink: data.imageLinks && data.imageLinks.thumbnail,
              language: data.language,
            }).then((bookData) => {
              resolve(bookData.uuid);
            });
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            reject();
          });
      }
    });
  });

const newBook = (bookData) =>
  new Promise((resolve, reject) => {
    Book.create(bookData)
      .then((book) => {
        resolve(book.uuid);
      })
      .catch(reject);
  });
module.exports = {
  fetchBookData,
  newBook,
};
