'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leaves', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      employeeId: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      reason: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected')
      },
      remainingLeave: {
        type: Sequelize.STRING
      },
      isArchive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Leaves');
  }
};