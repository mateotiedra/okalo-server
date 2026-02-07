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

const getBest = (_req, res) => {
  // TODO: Implement ranking logic (was commented out, needs proper query)
  // For now, return top institutions by user count
  Institution.findAll({
    limit: 5,
    attributes: ['id', 'name'],
  })
    .then((institutions) => {
      res.status(200).json({
        note: 'Ranking not yet implemented - returning all institutions',
        institutions,
      });
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  getSuggestedList,
  getInstitutionsById,
  getBest,
};
