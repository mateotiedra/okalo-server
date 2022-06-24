const updateObject = (object, updatedAttributes) => {
  for (const key in updatedAttributes) {
    object[key] = updatedAttributes[key];
  }

  object
    .save()
    .then(() => {
      res.status(200).json(filterUserAttributes(req.user));
    })
    .catch(unexpectedErrorCatch(res));
};

module.exports = {
  updateObject,
};
