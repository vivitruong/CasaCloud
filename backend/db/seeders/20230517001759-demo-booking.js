'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        listingId: 1,
        userId: 1,
        checkIn: '04-12-2023',
        checkOut: '04-18-2023',
        numGuest: 4
      },
      {
        listingId: 2,
        userId: 2,
        checkIn: '03-13-2023',
        checkOut: '03-20-23',
        numGuest: 3
      },
      {
        listingId: 3,
        userId: 3,
        checkIn: '05-19-2023',
        checkOut: '05-22-23',
        numGuest: 2

      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};
