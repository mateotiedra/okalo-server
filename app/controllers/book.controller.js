const axios = require('axios');
const config = require('../config/server.config');

const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const db = require('../models/db.model');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const Book = db.book;
const Bid = db.bid;
const User = db.user;
const Institution = db.institution;

const cleanIsbn = (isbn) => isbn.replaceAll('-', '');

const extractNeededData = (itemData) => {
  return {
    title: itemData.title,
    author: itemData.authors && itemData.authors.length && itemData.authors[0],
    publisher: itemData.publisher,
    coverLink:
      itemData.imageLinks &&
      (itemData.imageLinks['large'] ||
        itemData.imageLinks['medium'] ||
        itemData.imageLinks['small'] ||
        itemData.imageLinks['thumbnail']),
    language: itemData.language,
    // TODO : add retail price
  };
};

const fetchBookData = async (isbn) => {
  isbn = cleanIsbn(isbn);
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

  if (savedBook) return savedBook;

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
    return await Book.create({ isbn, ...bookData });
  } catch (error) {
    throw error;
  }
};

const getBookByIsbn = (req, res) => {
  const isbn = cleanIsbn(req.query.isbn);
  fetchBookData(isbn)
    .then((bookData) => {
      res.status(200).json(bookData);
    })
    .catch((err) => {
      if (err.message == 404) res.status(404).json({ message: 'not found' });
      else unexpectedErrorCatch(res)(err);
    });
};

const newBook = (bookData) =>
  new Promise((resolve, reject) => {
    Book.create(bookData)
      .then((book) => {
        resolve(book.uuid);
      })
      .catch(reject);
  });

const getSuggestedList = (req, res) => {
  const match = req.query.match.toLowerCase();
  const attr = req.query.attr;

  Book.findAll({
    limit: 5,
    where: {
      [Op.and]: [
        {
          [attr]: sequelize.where(
            sequelize.fn('LOWER', sequelize.col(attr)),
            'LIKE',
            match + '%'
          ),
        },
        /* {
          isbn: {
            [Op.ne]: null,
          },
        }, */
      ],
    },
  })
    .then((books) => {
      res.status(200).json(
        books.map((book) => {
          return book[attr];
        })
      );
    })
    .catch(unexpectedErrorCatch(res));
};

const searchBooks = (req, res) => {
  // Acc that and or list if req.query.allMatch is not true
  let andList = [];
  for (const attr of ['title', 'author', 'publisher', 'language']) {
    if (!req.query[attr]) continue;

    const attrQuery = req.query[attr].toLowerCase();
    for (const match of attrQuery.split(' ')) {
      andList.push({
        [attr]: sequelize.where(
          sequelize.fn('LOWER', sequelize.col(attr)),
          'LIKE',
          '%' + match + '%'
        ),
      });
    }
  }

  Book.findAll({
    where: {
      [req.query.allMatch ? Op.and : Op.or]: andList,
    },
    include: 'bids',
    attributes: {
      include: [
        [
          db.sequelize.literal(
            '(SELECT COUNT(*) FROM bid WHERE bid.bookUuid = book.uuid)'
          ),
          'n_bids',
        ],
      ],
    },
    order: [
      [db.sequelize.literal('n_bids'), 'DESC'],
      ['isbn', 'DESC'],
    ],
  }).then((books) => {
    const safeBooks = books.map((book) => {
      book.dataValues.nbrBids = book.bids.length;
      book.dataValues.bids = undefined;
      return book;
    });
    res.status(200).json(safeBooks);
  });
};

const getBookBoard = (req, res) => {
  Book.findByPk(req.query.uuid, {
    include: {
      model: Bid,
      attributes: ['uuid', 'condition', 'customisation', 'price'],
      include: [
        {
          model: User,
          attributes: ['username'],
          include: [{ model: Institution, attributes: ['name'] }],
        },
      ],
    },
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch(unexpectedErrorCatch(res));
};

// Admin
const cleanNoISBNBooks = (req, res) => {
  Book.findAll({
    where: {
      isbn: null,
    },
    include: 'bids',
  })
    .then(async (books) => {
      for (const book of books) {
        if (book.bids && book.bids.length === 0) {
          await book.destroy();
        }
      }
      res.status(200).json({ message: 'books deleted' });
    })
    .catch(unexpectedErrorCatch(res));
};

const getBest = (req, res) => {
  Book.findAll({
    limit: (req.query && req.query.limit && parseInt(req.query.limit)) || 5,
    where: db.sequelize.where(
      db.sequelize.literal(
        '(SELECT COUNT(*) FROM bid WHERE bid.bookUuid = book.uuid AND bid.status="sold" /* AND book.coverLink IS NOT NULL */)'
      ),
      Op.gt,
      0
    ),
    attributes: [
      [
        db.sequelize.literal(
          '(SELECT COUNT(*) FROM bid WHERE bid.bookUuid = book.uuid)'
        ),
        'n_bids',
      ],
      'title',
      'coverLink',
      'isbn',
      'uuid',
      //[db.sequelize.fn('COUNT', db.sequelize.col('bids')), 'n_bids'],
    ],
    order: [[db.sequelize.literal('n_bids'), 'DESC']],
  })
    .then((books) => {
      res.status(200).json(books);
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  fetchBookData,
  newBook,
  getSuggestedList,
  searchBooks,
  getBookBoard,
  getBookByIsbn,
  cleanNoISBNBooks,
  getBest,
};
