const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const db = require('../models/db.model');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const Institution = db.institution;

const getSuggestedList = (req, res) => {
  const match = req.query.name.toLowerCase();

  Institution.findAll({
    limit: 5,
    where: {
      name: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')),
        'LIKE',
        match + '%'
      ),
    },
  })
    .then((institutions) => {
      res.status(200).json(
        institutions.map((institution) => {
          return institution.name;
        })
      );
    })
    .catch(unexpectedErrorCatch(res));
};

const getInstitutionsById = async (ids) => {
  let orList = ids.map((id) => {
    return { id: id };
  });

  console.log(orList);

  try {
    return await Institution.findAll({
      limit: 5,
      where: {
        [Op.or]: orList,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSuggestedList,
  getInstitutionsById,
};
