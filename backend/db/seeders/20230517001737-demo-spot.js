'use strict';
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "5050 N Broadway Street",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 24.431519,
        lng: -111.898428,
        name: "Pink Cloud",
        description: "All of our funiture is in pink color",
        price: 100
      },
      {
        ownerId: 2,
        address: "1040 W HollyWood Ave",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 24.686554,
        lng: -12.188946,
        name: "DownTown Appartment in the heart of city",
        description: "Enjoy your best downtown view of Houston",
        price: 159
      },
      {
        ownerId: 3,
        address: "100 Dracut Street",
        city: "Boston",
        state: "Massachusetts",
        country: "United States of America",
        lat: 67.611224,
        lng: -8.178493,
        name: "Cozy Entire Guess Suite ",
        description: "Budget friendly master suite with bathtub inside the room",
        price: 280
      },
      {
        ownerId: 1,
        address: "15000 Park Row Dr",
        city: "Austin",
        state: "Texas",
        country: "United States of America",
        lat: 48.613214,
        lng: 22.199993,
        name: "Haunted apartment",
        description: " This place is haunted!!",
        price:180
      },
      {
        ownerId: 2,
        address: "1111 Main Street",
        city: "Richmond",
        state: "Washington",
        country: "United States of America",
        lat: 34.739129,
        lng: -122.098782,
        name: "Private 2 beds apartment",
        description: "Enjoy 5 mins walk to the heart of Wasington with this luxury apartment highrise",
        price: 159
      },
      {
        ownerId: 3,
        address: "999 King Street",
        city: "Cook",
        state: "Illinois",
        country: "United States of America",
        lat: 11.649999,
        lng: -23.212307,
        name: "Modern Private Yatch",
        description: "This 1 bed room 1 bad yatch right next to Michigan Lake will create your best experience ever",
        price: 300
      },
      {
        ownerId: 1,
        address: "111 Angel Street",
        city: "Vernon Hills",
        state: "Florida",
        country: "United States of America",
        lat: 23.361728,
        lng: -19.173829,
        name: "Entire Single House",
        description: "Enjoy this peaceful house with pool",
        price: 111
      },
      {
        ownerId: 2,
        address: "4647 N Avondale Ave",
        city: "Hai Phong",
        state: "California",
        country: "United States of America",
        lat: 13.916859,
        lng: -100.027882,
        name: "Happy Home",
        description: "This beautiful modern and private home will bring you relaxtation",
        price: 210
      },
      {
        ownerId: 3,
        address: "1800 North Hills Ave",
        city: "Dorchester",
        state: "Texas",
        country: "United States of America",
        lat: 13.534588,
        lng: -10.186571,
        name: "Lovely Cozy Unit near the Lake",
        description: "Lovely unit right next to the Lake of the city",
        price: 100
      },
      {
        ownerId: 3,
        address: "1403 Wood Street",
        city: "Tahoe",
        state: "California",
        country: "United States of America",
        lat: 34.134570,
        lng: -11.330162,
        name: "Tree house",
        description: "Enjoy this unique Tree home inside my backyard",
        price: 60
      },
      {
        ownerId: 1,
        address: "33 Vivi Street",
        city: "Santa Monica",
        state: "California",
        country: "United States of America",
        lat: 37.594817,
        lng: -1.244873,
        name: "Private bed room with shared bathroom",
        description: "Quiet and clean bedroom ",
        price: 30
      },
      {
        ownerId: 2,
        address: "888 Devil Street",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 28.374954,
        lng:-23.811462,
        name: "Charming 2 Bedroom 2 Bath Apartment",
        description: "You and your family will enjoy this 2 bed 2 bath appartment unit",
        price: 100
      },

    ], {});
  },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options,
      {
        ownerId: { [Op.in]: [1, 2, 3] }
      }, {});
  }
};
