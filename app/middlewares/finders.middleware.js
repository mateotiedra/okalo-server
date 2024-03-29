const {
  objectNotFoundRes,
  unexpectedErrorCatch,
} = require('../helpers/errorCatch.helper');
const {
  verifyRequestBody,
  verifyQueryParams,
} = require('./request.middleware');

const db = require('../models/db.model');
const User = db.user;
const Book = db.book;
const Bid = db.bid;

const findObjectByAttribute =
  (DefinedObject, definedObjectName) =>
  (attribute, reqAttribute, required = true) =>
  (req, res, next) => {
    if (!reqAttribute) reqAttribute = attribute;
    const attributeInQueryParams = req.method === 'GET';
    if (
      (!attributeInQueryParams &&
        verifyRequestBody([reqAttribute])(req, res, () => {})) ||
      (attributeInQueryParams &&
        verifyQueryParams([reqAttribute])(req, res, () => {}))
    ) {
      return;
    }

    DefinedObject.findOne({
      where: {
        [attribute]: attributeInQueryParams
          ? req.query[reqAttribute]
          : req.body[reqAttribute],
      },
    })
      .then((definedObject) => {
        if (!definedObject && required)
          return objectNotFoundRes(res, definedObjectName);
        req[definedObjectName] = definedObject;
        next();
      })
      .catch(unexpectedErrorCatch(res));
  };

const objectFinders = {
  findUserByAttribute: findObjectByAttribute(User, 'user'),
  findBookByISBN: findObjectByAttribute(Book, 'book')('isbn', 'isbn', false),
  findBidByAttribute: findObjectByAttribute(Bid, 'bid'),
};

module.exports = {
  findObjectByAttribute,
  ...objectFinders,
};
