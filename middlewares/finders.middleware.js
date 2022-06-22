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

const findObjectByAttribute =
  (DefinedObject, definedObjectName) =>
  (attribute, reqAttribute) =>
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
        if (!definedObject) return objectNotFoundRes(res, definedObjectName);
        req[definedObjectName] = definedObject;
        next();
      })
      .catch(unexpectedErrorCatch(res));
  };

const objectFinders = {
  findUserByAttribute: findObjectByAttribute(User, 'user'),
};

module.exports = {
  findObjectByAttribute,
  ...objectFinders,
};
