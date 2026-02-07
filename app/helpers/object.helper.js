/**
 * Update a Sequelize model instance with new attributes and save
 * @param {Object} object - Sequelize model instance
 * @param {Object} updatedAttributes - Attributes to update
 * @returns {Promise} - Resolves with saved object
 */
const updateObject = async (object, updatedAttributes) => {
  for (const key in updatedAttributes) {
    object[key] = updatedAttributes[key];
  }
  return object.save();
};

module.exports = {
  updateObject,
};
