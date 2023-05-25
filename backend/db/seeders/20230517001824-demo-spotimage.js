'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://imgur.com/gallery/m6K1DCQ",
        preview: true
      },
      {
        spotId: 2,
        url: "https://imgur.com/gallery/Eu988fE",
        preview: true
      },
      {
        spotId: 3,
        url: "https://imgur.com/gallery/jMrJI4x",
        preview: true
      },
      {
        spotId: 4,
        url: "https://imgur.com/gallery/dB03i",
        preview: true
      },
      {
        spotId: 5,
        url: "https://imgur.com/gallery/Y9fob",
        preview: true
      },
      {
        spotId: 6,
        url: "https://imgur.com/gallery/DQpaxYO",
        preview: true
      },
      {
        spotId: 7,
        url: "https://imgur.com/gallery/YqiiL",
        preview: true
      },
      {
        spotId: 8,
        url: "https://imgur.com/gallery/Ft1XsIn",
        preview: true
      },
      {
        spotId: 9,
        url: "https://imgur.com/gallery/cQeQJ",
        preview: true
      },
      {
        spotId: 10,
        url: "https://imgur.com/gallery/J9rSgQq",
        preview: true
      },
      {
        spotId: 11,
        url: "https://imgur.com/gallery/aiPAZEg",
        preview: true
      },
      {
        spotId: 12,
        url: "https://imgur.com/gallery/EpRq2",
        preview: true
      },

    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, null, {});
  }
};
