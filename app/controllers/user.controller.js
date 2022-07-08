const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
} = require('../helpers/errorCatch.helper');

const institutionController = require('./institution.controller');

const User = db.user;
const Bid = db.bid;
const Book = db.book;
const Op = db.Sequelize.Op;

const filterUserAttributes = (user) => {
  User.blackListAttributes.forEach((attribute) => {
    user.dataValues[attribute] = undefined;
  });

  return user;
};

const getUserBoard = async (req, res) => {
  const user = await User.findByPk(req.user.uuid, {
    include: [
      {
        model: Bid,
        attributes: ['uuid', 'condition', 'customisation', 'price'],
        include: { model: Book, attributes: ['title', 'publisher'] },
      },
    ],
    attributes: { exclude: User.blackListAttributes },
  });

  return res.status(200).json(user);
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

const updateUserParameters = async (req, res) => {
  const parametersAttr = ['username', 'phone', 'instagram'];
  parametersAttr.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });

  if (req.body.institutionIds)
    await req.user.setInstitutions(
      await institutionController.getInstitutionsById(req.body.institutionIds)
    );

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
