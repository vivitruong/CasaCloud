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
        spotId: 1,
        userId: 1,
        review: "Me and my boyfriend broke up so we decided not to go to this place anymore",
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: "If you enjoy sleeping on mattresses that have more springs than a trampoline, this is the place for you!",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "I am too poor for this place but its beautiful!",
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
        review: "The hotel room was so tiny, I had to go outside to change my mind.",
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
        review: "The room is as cold as my crush's heart! :(",
        stars: 5
      },
      {
        spotId: 5,
        userId: 5,
        review: "I stayed at an Airbnb that had a 'rustic' feel, which apparently meant no Wi-Fi, a shower that dribbled water, and an enthusiastic squirrel roommate",
        stars: 5
      },
      {
        spotId: 6,
        userId: 2,
        review: "The place's continental breakfast consisted of a single croissant and an existential crisis",
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
        review: "The hotel had a stunning ocean view... from the bathroom window. I now have an intimate relationship with seagulls",
        stars: 4
      },
      {
        spotId: 10,
        userId: 4,
        review: "This Airbnb was so cozy, I nearly forgot I wasn't in my own house... until I found a llama in the kitchen",
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
        review: "Staying at this Airbnb was a rollercoaster ride of emotions... mostly because the bed creaked every time I moved, and I felt like I was being launched into space.",
        stars: 4
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3,4, 5, 6] }
    }, {});
  }
};
