'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Images';
    await queryInterface.bulkInsert(options, [
      {
        url: 'https://imgur.com/gallery/aIVBQIb',
        previewImage: true,
        imageableId: 1,
        imageableType: 'Review'
      },
      {
        url: 'https://imgur.com/gallery/TIUnB5f',
        imageableId: 2,
        previewImage: true,
        imageableType: 'Review'
      },
      {
        url: 'https://imgur.com/gallery/zCIky',
        imageableId: 3,
        previewImage: true,
        imageableType: 'Listing'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.dropTable(options, {
      imageableId: { [Op.in]: [1,2,3]}
    }, {})
  }
};
