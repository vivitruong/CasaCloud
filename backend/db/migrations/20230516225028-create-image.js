let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Images';
    await queryInterface.createTable(options, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reviewImage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imageableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Listings', // Reference 'Listings' table
          key: 'id'
        },
        onDelete: 'cascade'
      },
      imageableType: {
        type: Sequelize.ENUM('Review', 'Listing'),
        allowNull: false
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

    // Add a separate constraint for referencing 'Reviews' table
    await queryInterface.addConstraint('Images', {
      fields: ['imageableId'],
      type: 'foreign key',
      name: 'fk_imageableId_reviews',
      references: {
        table: 'Reviews',
        field: 'id'
      },
      onDelete: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images');
  }
};




// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;
// }
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     options.tableName = 'Images';
//     await queryInterface.createTable(options, {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       reviewImage: {
//         type: Sequelize.STRING,
//         allowNull: false
//       },
//       imageableId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: {
//             tableName: ['Listings', 'Reviews']
//           },
//           key: 'id'
//         },
//         onDelete: 'cascade'
//       },
//       imageableType: {
//         type: Sequelize.ENUM('Review', 'Listing'),
//         allowNull: false
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Images');
//   }
// };
