'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'EmployeePreWorks',
      [
        {
          employeeId: "4889ed9b-6fa3-4b25-8a27-68779ec3179f",
          previousEmployer: "l&t",
          employerAddress: "ahmedabad, gujatat",
          workingTime: "3 years 2 month",
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: "606559db-df9a-4c1f-8243-ef803e52cfa4",
          previousEmployer: "infex",
          employerAddress: "vadodara, gujatat",
          workingTime: "2 years 2 month",
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: "d475cab4-c199-40e9-813e-fa648d1c6fea",
          previousEmployer: "softVolt",
          employerAddress: "ahmedabad, gujatat",
          workingTime: "1 years 10 month",
          startDate: new Date(),
          endDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmployeePreWorks', null, {});
  }
};
