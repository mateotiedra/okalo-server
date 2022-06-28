const db = require('../models/db.model');
const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const bookController = require('../controllers/book.controller');

const Bid = db.bid;

const blackListAttributes = ['userUuid'];

const filterBidAttributes = (bid) => {
  const attributesToSend = Object.keys(User.rawAttributes).filter(
    (attribute) => !blackListAttributes.includes(attribute)
  );

  let bidSafeData = {};

  attributesToSend.forEach((attribute) => {
    bidSafeData[attribute] = user.dataValues[attribute];
  });

  return bidSafeData;
};

const newBid = (req, res) => {
  if (req.body.isbn)
    bookController
      .fetchBookData(req.body.isbn)
      .then((bookUuid) => {
        Bid.create({
          condition: req.body.condition,
          customisation: req.body.customisation,
          price: req.body.price,
          bookUuid: bookUuid,
        }).then((bookData) => {
          res.status(200).json(bookData);
        });
      })
      .catch(() => {
        res.status(404).json({ message: 'Book not found with the ISBN' });
      });
};

const getBidBoard = (req, res) => {
  return res.status(200).json(filterBidAttributes(req.bid));
};

const updateBidParameters = (req, res) => {
  const parametersAttr = ['condition', 'annotation', 'price'];
  parametersAttr.forEach((key) => {
    if (req.body[key] !== undefined) req.bid[key] = req.body[key];
  });

  req.bid
    .save()
    .then(() => {
      res.status(200).json(filterBidAttributes(req.user));
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
