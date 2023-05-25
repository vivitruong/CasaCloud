'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert('ReviewImages', [
    {
      reviewId: 1,
      url: "https://imgur.com/gallery/m6K14CQ"
    },
    {
      reviewId: 2,
      url: "https://imgur.com/gallery/m6K1jgQ"
    },
    {
      reviewId: 3,
      url: "https://imgur.com/gallery/mf8kDCQ"
    }
  ])
},

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('ReviewImages', null, {});
  }
};
