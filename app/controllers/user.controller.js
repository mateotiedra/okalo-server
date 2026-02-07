const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
} = require('../helpers/errorCatch.helper');

const institutionController = require('./institution.controller');

const User = db.user;
const Bid = db.bid;
const Book = db.book;
const Institution = db.institution;

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
        attributes: { exclude: ['useruuid'] },
        include: { model: Book, exclude: [Bid.blackListAttributes] },
      },
      { model: Institution, attributes: ['name'] },
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

const getBest = (req, res) => {
  User.findAll({
    limit: (req.query && req.query.limit && parseInt(req.query.limit)) || 5,
    attributes: [
      [
        db.sequelize.literal(
          '(SELECT COUNT(*) FROM bid WHERE bid.userUuid = user.uuid)'
        ),
        'n_bids',
      ],
      'username',
      //[db.sequelize.fn('COUNT', db.sequelize.col('bids')), 'n_bids'],
    ],
    order: [[db.sequelize.literal('n_bids'), 'DESC']],
  })
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
  const parametersAttr = ['phone', 'instagram'];
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

const updateUserInstitutions = (req, res) => {
  req.user
    .setInstitutions(req.body.newInstitutionIds)
    .then((data) => {
      res.status(200).json(data);
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
  updateUserInstitutions,
  deleteUser,
  getBest,
};
