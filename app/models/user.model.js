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
    // Other attributes
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    instagram: {
      type: DataTypes.STRING,
    },
  };

  const User = sequelize.define('user', attributes);

  User.associate = (models) => {
    User.hasMany(models.bid, { onDelete: 'CASCADE' });
    User.belongsToMany(models.institution, {
      through: models.institution.UserLinkTable,
    });
  };

  User.blackListAttributes = [
    'uuid',
    'emailToken',
    'emailTokenGeneratedAt',
    'password',
    'updatedAt',
  ];

  return User;
};
