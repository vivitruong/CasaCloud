'use strict';

const { describe } = require('mocha');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Listings';
    return queryInterface.bulkInsert(options, [
      {
        hostId: 1,
        address: '5050 Broadway Street',
        city: 'Chicago',
        state: 'Illinois',
        country: 'United States of America',
        lat: 10.123456,
        lng: 15.123456,
        name: 'Pink Cloud',
        description: 'This place has all funiture in Pink',
        price : 150.00
      },
      {
        hostId: 2,
        address: '1500 Park Row Street',
        city: 'Houston',
        state: 'Texas',
        country: 'United States of America',
        lat: 40.546547,
        lng: 18.123269,
        name: 'Bubble Tea',
        description: 'This place offer all included buffet and bubble tea',
        price : 230.00
      },
      {
        hostId: 3,
        address: '602 Geneva Ave',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States of America',
        lat: 38.573847,
        lng: 22.859269,
        name: 'Spooky',
        description: 'Come and enjoy this unique spooky experience with this abandoned place!',
        price : 280.00
      },
      {
        hostId: 4,
        address: '420 West Street',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 57.243547,
        lng: 48.165269,
        name: 'Euphoria',
        description: 'Mid-century-inspired decor with no food, no TV, no Internet for the best experience of your life',
        price : 230.00
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
   options.tableName = 'Listings';
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete(options, {
    hostId: { [Op.in]: [1, 2, 3 ,4 ]}
   }, {})
  }
};
