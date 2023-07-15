'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/A2.jpg"
    },
    {
      reviewId: 2,
      url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/B2.jpg"
    },
    {
      reviewId: 3,
      url: "https://casacloudpics.s3.us-east-2.amazonaws.com/casacloudpics/C2.jpg"
    }
  ], {})
},

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, null, {});
  }
};
