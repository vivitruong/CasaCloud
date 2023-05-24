'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'Lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Fake',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'User',
        lastName: 'Fake',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'javrisle',
        hashedPassword: bcrypt.hashSync('password@234'),
        firstName: "Nhat",
        lastName: "Nguyen"
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password@22234'),
        firstName: "Barack",
        lastName: "Obama"
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password@234'),
        firstName: "Joe",
        lastName: "Biden"
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password@234@'),
        firstName: "Donald",
        lastName: "Trump"
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  },
}
