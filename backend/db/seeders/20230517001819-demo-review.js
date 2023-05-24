'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 2,
        review: "I love this place would recommend",
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: "Yassss girl! Come here right now, this place is two beautiful",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "Will comeback if I do visited this city again",
        stars: 4
      },
      {
        spotId: 3,
        userId: 4,
        review: "Its a nice place but I could hear my neighbor talk",
        stars: 3
      },
      {
        spotId: 1,
        userId: 4,
        review: "Beautiful place, the wifi is a little slow",
        stars: 4
      },
      {
        spotId: 4,
        userId: 5,
        review: "I dont like this appartment because its quite dirty",
        stars: 3
      },
      {
        spotId: 1,
        userId: 5,
        review: "This place has the best view",
        stars: 5
      },
      {
        spotId: 5,
        userId: 5,
        review: "The host is very fast to response. Would recommend for my friend",
        stars: 5
      },
      {
        spotId: 6,
        userId: 2,
        review: "WOW! The best experience I've ever had in my 24 years of living",
        stars: 5
      },
      {
        spotId: 7,
        userId: 6,
        review: "Decent Place, easy to come to nearby restaurant",
        stars: 4
      },
      {
        spotId: 8,
        userId: 6,
        review: "Nice place but the view is not nice",
        stars: 4
      },
      {
        spotId: 10,
        userId: 4,
        review: "Clean and quiet",
        stars: 5
      },
      {
        spotId: 11,
        userId: 4,
        review: "Location is perf, very close by downtown",
        stars: 5
      },
      {
        spotId: 11,
        userId: 5,
        review: "I love this stay but the parking is little dirty",
        stars: 4
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options.tableName, {
      userId: { [Op.in]: [1, 2, 3,4, 5, 6] }
    }, {});
  }
};
