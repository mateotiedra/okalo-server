module.exports = (sequelize, DataTypes) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  const Institution = sequelize.define('institution', attributes);

  sequelize.define('User_Institutions', {}, { timestamps: false });

  Institution.associate = (models) => {
    Institution.belongsToMany(models.user, { through: 'User_Institutions' });
  };

  return Institution;
};
