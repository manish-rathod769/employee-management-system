'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert(
      'Leaves', [{
        id: uuidv4(),
        employeeId: "employee001",
        startDate: "2022-05-13",
        endDate: "2022-05-15",
        status: "pending",
        remainingLeave: "13 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: uuidv4(),
        employeeId: "employee002",
        startDate: "2022-05-13",
        endDate: "2022-05-15",
        status: "rejected",
        remainingLeave: "13 days",
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {},
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Leaves', null, {});

  }
};
