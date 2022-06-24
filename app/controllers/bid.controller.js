const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
} = require('../helpers/errorCatch.helper');

const Bid = db.bid;
const Op = db.Sequelize.Op;

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
  if (!req.user) res.status(401).json({ message: 'Not authenticated' });
  if (req.book) console.log('known');
  else {
    if (req.body.isbn) console.log('go look');
  }
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
