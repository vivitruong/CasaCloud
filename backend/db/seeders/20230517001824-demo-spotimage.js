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
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa10.webp",
        preview: true
      },
      {
        spotId: 2,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa9.webp",
        preview: true
      },
      {
        spotId: 3,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa8.webp",
        preview: true
      },
      {
        spotId: 4,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa7.webp",
        preview: true
      },
      {
        spotId: 5,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa6.webp",
        preview: true
      },
      {
        spotId: 6,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa5.webp",
        preview: true
      },
      {
        spotId: 7,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa4.webp",
        preview: true
      },
      {
        spotId: 8,
        url: "hhttps://casacloudpics.s3.us-east-2.amazonaws.com/casa3.webp",
        preview: true
      },
      {
        spotId: 9,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casa2.webp",
        preview: true
      },
      {
        spotId: 10,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/J1.jpg",
        preview: true
      },
      {
        spotId: 11,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/L1.jpg",
        preview: true
      },
      {
        spotId: 12,
        url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/K1.jpg",
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
