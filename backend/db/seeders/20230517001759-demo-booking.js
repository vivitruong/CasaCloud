
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
        spotId: 1,
        userId: 1,
        startDate: "2023-6-16",
        endDate: "2023-6-20"
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2023-3-30",
        endDate: "2023-4-1"
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2023-10-30",
        endDate: "2023-11-8"
      },
      {
        spotId: 1,
        userId: 4,
        startDate: "2023-4-1",
        endDate: "2023-4-5"
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3, 4] }
    }, {})
  }
};
