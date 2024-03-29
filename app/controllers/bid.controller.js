const db = require('../models/db.model');
const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const bookController = require('../controllers/book.controller');

const Bid = db.bid;
const User = db.user;
const Book = db.book;
const Institution = db.institution;

const blackListAttributes = ['userUuid', 'deletedAt'];

const filterBidAttributes = (bid) => {
  const attributesToSend = Object.keys(Bid.rawAttributes).filter(
    (attribute) => !blackListAttributes.includes(attribute)
  );

  let bidSafeData = {};

  attributesToSend.forEach((attribute) => {
    bidSafeData[attribute] = bid.dataValues[attribute];
  });

  return bidSafeData;
};

const newBid = async (req, res) => {
  var bookUuid;
  if (req.body.isbn) {
    // Go fetch the book uuid
    bookUuid = (
      await bookController.fetchBookData(req.body.isbn).catch((err) => {
        err.message == 404
          ? res.status(404).json({ message: 'Book not found with the ISBN' })
          : unexpectedErrorCatch(res)(err);
      })
    ).dataValues.uuid;
  } else {
    // Create a new book without isbn
    if (!req.body.title)
      return res.status(400).json({
        message: 'Bad request. Missing title',
      });

    bookUuid = await bookController
      .newBook({
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        language: req.body.language,
      })
      .catch(unexpectedErrorCatch(res));
  }

  // Quit if the isbn found nothing and the new book from given params (title, ...) failed
  if (!bookUuid) return;

  // Create the bid
  Bid.create({
    condition: req.body.condition,
    customisation: req.body.customisation,
    price: req.body.price,
    comment: req.body.comment,
    userUuid: req.user.uuid,
    bookUuid: bookUuid,
  })
    .then((bid) => {
      bid.userUuid = undefined;
      res.status(200).json(bid);
    })
    .catch(unexpectedErrorCatch(res));
};

const getBidBoard = (req, res) => {
  Bid.findByPk(req.query.uuid, {
    attributes: { exclude: blackListAttributes },
    include: [
      {
        model: User,
        attributes: ['username'],
        include: { model: Institution, attributes: ['name'] },
      },
      { model: Book },
    ],
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch(unexpectedErrorCatch(res));
};

const updateBidParameters = (req, res) => {
  const parametersAttr = ['condition', 'customisation', 'price', 'comment'];
  parametersAttr.forEach((key) => {
    if (req.body[key] !== undefined) req.bid[key] = req.body[key];
  });

  req.bid
    .save()
    .then(() => {
      res.status(200).json(filterBidAttributes(req.bid));
    })
    .catch(unexpectedErrorCatch(res));
};

const deleteBid = async (req, res) => {
  // Change the status of the bid
  req.bid.status = req.body.sold ? 'sold' : 'deleted';
  try {
    await req.bid.save();
  } catch (err) {
    unexpectedErrorCatch(res)(err);
  }

  // Save bid's book
  var book;
  try {
    book = await req.bid.getBook();
  } catch (err) {
    unexpectedErrorCatch(res)(err);
  }

  // Delete bid
  try {
    await req.bid.destroy();
    res.status(204).send();
  } catch (err) {
    unexpectedErrorCatch(res)(err);
  }

  // Delete book if it has no more bid and no isbn
  try {
    if (book.isbn || (await book.getBids()).length > 0) return;
    await book.destroy();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  newBid,
  getBidBoard,
  updateBidParameters,
  deleteBid,
};
