module.exports = (sequelize, DataTypes) => {
  const attributes = {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    condition: {
      type: DataTypes.ENUM,
      values: ['new', 'good', 'damaged'],
      defaultValue: 'good',
    },
    customisation: {
      type: DataTypes.ENUM,
      values: ['none', 'little', 'lot'],
      defaultValue: 'little',
    },
    price: {
      type: DataTypes.SMALLINT,
    },
    comment: {
      type: DataTypes.TEXT('medium'),
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'deleted', 'sold'],
      defaultValue: 'pending',
    },
  };

  const Bid = sequelize.define('bid', attributes, { paranoid: true });

  Bid.associate = (models) => {
    Bid.belongsTo(models.book);

    Bid.belongsTo(
      models.user /* {
      as: 'bids',
      foreignKey: {
        name: 'ownerUuid',
        allowNull: false,
      },
    } */
    );
  };

  return Bid;
};
