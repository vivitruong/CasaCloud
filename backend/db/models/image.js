'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    static associate(models) {

      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        }
      });
      Image.belongsTo(models.Listing, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: "Listing"
        }
      });

    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING(),
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    previewImage: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageableType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
