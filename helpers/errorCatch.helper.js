const unexpectedErrorCatch = (res) => (err) => {
  res.status(500).json({ message: 'Unexpected error : ' + err.message });
};

const objectNotFoundRes = (res, object = 'User') => {
  return res.status(404).json({ message: object + ' not found.' });
};

const uniqueAttributeErrorCatch = (res, next) => (err) => {
  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(409).json({
      message: `Failed! Attributes already in used : ${Object.keys(
        err.fields
      )}`,
    });

  next(res)(err);
};

module.exports = {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
  objectNotFoundRes,
};
