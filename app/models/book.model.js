module.exports = (sequelize, DataTypes) => {
  const attributes = {
    isbn: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    edition: {
      type: DataTypes.BIGINT,
    },
  };

  const Book = sequelize.define('book', attributes);

  Book.associate = (models) => {
    Book.hasMany(models.bid);
  };

  return Book;
};
