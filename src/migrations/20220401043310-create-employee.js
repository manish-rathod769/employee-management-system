'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('male', 'female')
      },
      role: {
        typs: Sequelize.ENUM('ADMIN', 'PM', 'HR', 'DEV')
      },
      DOB: {
        type: Sequelize.DATE
      },
      verifyToken: {
        typs: Sequelize.STRING
      },
      isArchive: {
        type: Sequelize.BOOLEAN
      },
      joiningDate: {
        type: Sequelize.DATE
      },
      totalExp: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Employees');
  }
};