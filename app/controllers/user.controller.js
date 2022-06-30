const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
} = require('../helpers/errorCatch.helper');

const User = db.user;
const Op = db.Sequelize.Op;

const filterUserAttributes = (user) => {
  const attributesToSend = Object.keys(User.rawAttributes).filter(
    (attribute) => !User.blackListAttributes.includes(attribute)
  );

  let userSafeData = {};

  attributesToSend.forEach((attribute) => {
    userSafeData[attribute] = user.dataValues[attribute];
  });

  return userSafeData;
};

const getUserBoard = (req, res) => {
  const userData = filterUserAttributes(req.user);
  return res.status(200).json(userData);
};

const getEveryUserBoard = (req, res) => {
  User.findAll({ attributes: { exclude: User.blackListAttributes } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(unexpectedErrorCatch(res));
};

const updateUserRole = (req, res) => {
  req.user.role = req.body.newRole;
  req.user
    .save()
    .then(() => {
      res.status(200).json(filterUserAttributes(req.user));
    })
    .catch(unexpectedErrorCatch(res));
};

const updateUserParameters = (req, res) => {
  const parametersAttr = ['email'];
  parametersAttr.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });

  req.user
    .save()
    .then(() => {
      res.status(200).json(filterUserAttributes(req.user));
    })
    .catch(unexpectedErrorCatch(res));
};

const deleteUser = (req, res) => {
  req.user
    .destroy()
    .then(() => {
      res.status(204).json({ message: 'The user has been deleted' });
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  getUserBoard,
  getEveryUserBoard,
  updateUserRole,
  updateUserParameters,
  deleteUser,
};
