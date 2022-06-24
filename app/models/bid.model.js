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
    annotation: {
      type: DataTypes.ENUM,
      values: ['not', 'little', 'good'],
      defaultValue: 'little',
    },
    price: {
      type: DataTypes.SMALLINT,
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
