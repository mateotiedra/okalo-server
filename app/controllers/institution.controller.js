// const { default: axios } = require('axios');  // TODO: Remove if unused
const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const db = require('../models/db.model');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const Institution = db.institution;

const getSuggestedList = (req, res) => {
  const where = req.query.name
    ? {
        name: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')),
          'LIKE',
          req.query.name.toLowerCase() + '%'
        ),
      }
    : undefined;

  Institution.findAll({
    where: where,
  })
    .then((institutions) => {
      res.status(200).json(institutions);
    })
    .catch(unexpectedErrorCatch(res));
};

const getInstitutionsById = async (ids) => {
  let orList = ids.map((id) => {
    return { id: id };
  });

  console.log(orList);

  return await Institution.findAll({
    limit: 5,
    where: {
      [Op.or]: orList,
    },
  });
};

const getBest = (_req, _res) => {
  /* Institution.findAll({
    limit: (req.query && req.query.limit && parseInt(req.query.limit)) || 1,
    attributes: [
      [
        db.sequelize.literal(
          `(SELECT users.uuid
          FROM users
          INNER JOIN user_institutions
          ON Users.uuid = user_institutions.userUuid
          WHERE user_institutions.institutionId = institution.id)`
          //'SELECT COUNT(*) FROM bid WHERE bid.userUuid = institutions_Users.uuid'
        ),
        'n_bids',
      ],
      'name',
    ],
    //order: [[db.sequelize.literal('n_users'), 'DESC']],
  })
    .then((institutions) => {
      console.log(institutions);
      res.status(200).json(institutions);
    })
    .catch(unexpectedErrorCatch(res)); */
};

module.exports = {
  getSuggestedList,
  getInstitutionsById,
  getBest,
};
