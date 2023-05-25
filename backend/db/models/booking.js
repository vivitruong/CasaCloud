'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {

    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.Spot, {foreignKey: 'spotId'}
      );
      Booking.belongsTo(
        models.User, {
          foreignKey: 'userId'
        }
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
