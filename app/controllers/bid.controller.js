const db = require('../models/db.model');
const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const bookController = require('../controllers/book.controller');

const Bid = db.bid;

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
  let bookUuid;
  if (req.body.isbn) {
    // Go fetch the book data
    bookUuid = await bookController.fetchBookData(req.body.isbn).catch(() => {
      res.status(404).json({ message: 'Book not found with the ISBN' });
    });
  } else {
    // Create a new book without isbn
    if (!req.body.title || !req.body.language)
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
    userUuid: req.user.uuid,
    bookUuid: bookUuid,
  })
    .then((bid) => {
      res.status(200).json(bid);
    })
    .catch(unexpectedErrorCatch(res));
};

const getBidBoard = (req, res) => {
  return res.status(200).json(filterBidAttributes(req.bid));
};

const updateBidParameters = (req, res) => {
  const parametersAttr = ['condition', 'customisation', 'price'];
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

const deleteBid = (req, res) => {
  req.bid
    .destroy()
    .then(() => {
      res.status(204).json({ message: 'The bid has been deleted' });
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  newBid,
  getBidBoard,
  updateBidParameters,
  deleteBid,
};
