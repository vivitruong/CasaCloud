'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Listing.belongsTo(models.User, {foreignKey: 'hostId'});
      Listing.hasMany(models.Booking, {foreignKey: 'listingId'});
      Listing.hasMany(models.Review, {foreignKey: 'listingId'});
      Listing.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Listing'
        }

      })
    }
  }
  Listing.init({
    hostId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notEmpty: true
      }
    },
    address:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
        notEmpty: true
      }
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        max: 50
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lat:{
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: -90.999999,
        max: 90.999999
      }
    },
    lng:{
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};