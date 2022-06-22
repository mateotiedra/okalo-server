const verifyRequestBody = (requiredBodyKeys) => (req, res, next) => {
  const bodyKeys = Object.keys(req.body);
  const missingKeys = requiredBodyKeys.filter((n) => !bodyKeys.includes(n));
  if (missingKeys.length)
    return res
      .status(400)
      .json({ message: 'Bad request. Missing key(s) in body: ' + missingKeys });

  next();
};

const verifyQueryParams = (requiredBodyKeys) => (req, res, next) => {
  const bodyKeys = Object.keys(req.query);
  const missingKeys = requiredBodyKeys.filter(
    (n) => !bodyKeys.includes(n) || n === 'undefined'
  );
  if (missingKeys.length)
    return res.status(400).json({
      message: 'Bad request. Missing params(s) in query: ' + missingKeys,
    });

  next();
};

module.exports = {
  verifyRequestBody,
  verifyQueryParams,
};
