'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {

    static associate(models) {

      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false
      });
      Image.belongsTo(models.Listing, {
        foreignKey: 'imageableId',
        constraints: false
      });

    }
  }
  Image.init({
    reviewImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageableType: {
      type: DataTypes.ENUM,
      values: ['Review', 'Listing'],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
