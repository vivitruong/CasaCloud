'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users'
        },
        onDelete: 'cascade'
      },
      listingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Listings'
        },
        onDelete: 'cascade'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      review: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings'
        },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
