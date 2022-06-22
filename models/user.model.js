module.exports = (sequelize, DataTypes) => {
  const attributes = {
    // Auth attributes
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailToken: {
      type: DataTypes.STRING,
    },
    emailTokenGeneratedAt: {
      type: DataTypes.BIGINT,
    },
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'disabled'),
      defaultValue: 'pending',
    },
    role: {
      type: DataTypes.ENUM('admin', 'mod', 'user'),
      defaultValue: 'user',
    },
  };

  const User = sequelize.define('user', attributes);

  return User;
};
