'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        listingId: 1,
        review: 'I felt like I was on cloud 9, would comeback',
        rating: 5,
        bookingId: 1
      },
      {
        userId: 2,
        listingId: 2,
        review: 'yass girl!! Wonderful place to stay',
        rating: 4,
        bookingId: 2
      },
      {
        userId: 3,
        listingId: 3,
        review: 'I love the place, only give 4 star because the parking was a little dirty',
        rating: 4,
        bookingId: 3
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
