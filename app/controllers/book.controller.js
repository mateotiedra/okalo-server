const axios = require('axios');
const config = require('../config/server.config');

const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const db = require('../models/db.model');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Book = db.book;

const fetchBookData = async (isbn) => {
  // Fetch to the saved books first
  let savedBook;
  try {
    savedBook = await Book.findOne({
      where: {
        isbn: isbn,
      },
    });
  } catch (error) {
    throw error;
  }

  if (savedBook) return savedBook.uuid;

  // Fetch data from an outside api
  let data;
  try {
    ({ data } = await axios.get(config.ISBN_API_URL + isbn));
  } catch (error) {
    throw error;
  }

  // If nothing is returned leave with an error
  if (!(data && data.items && data.items.length && data.items[0].volumeInfo))
    throw new Error(404);

  // Extract the needed data
  let bookData = extractNeededData(data.items[0].volumeInfo);

  // If not every field in defined go look to the selfLink who has more informations
  for (const key in bookData) {
    if (bookData[key] == undefined) {
      ({ data } = await axios.get(data.items[0].selfLink));
      bookData = extractNeededData(data.volumeInfo);
      break;
    }
  }

  try {
    const { uuid } = await Book.create({ isbn, ...bookData });
    return uuid;
  } catch (error) {
    throw error;
  }
};

const extractNeededData = (itemData) => {
  return {
    title: itemData.title,
    author: itemData.authors && itemData.authors.length && itemData.authors[0],
    publisher: itemData.publisher,
    coverLink: itemData.imageLinks && itemData.imageLinks.thumbnail,
    language: itemData.language,
  };
};

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
