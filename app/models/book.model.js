module.exports = (sequelize, DataTypes) => {
  const attributes = {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    publisher: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
    },
    coverLink: {
      type: DataTypes.STRING,
    },
  };

  const Book = sequelize.define('book', attributes);

  Book.associate = (models) => {
    Book.hasMany(models.bid);
  };

  return Book;
};
