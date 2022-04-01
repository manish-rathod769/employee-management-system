'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'EmployeeAcademics',
      [
        {
          employeeId: "4889ed9b-6fa3-4b25-8a27-68779ec3179f",
          highestQualification: "BE",
          collage: "VGEC",
          university: "GTU",
          knownTech: [1, 2, 3],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: "606559db-df9a-4c1f-8243-ef803e52cfa4",
          highestQualification: "ME",
          collage: "PT",
          university: "VNSGU",
          knownTech: [4, 2, 3],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: "d475cab4-c199-40e9-813e-fa648d1c6fea",
          highestQualification: "B. Tech.",
          collage: "nirma",
          university: "nirma",
          knownTech: [1, 2, 3, 5, 7],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmployeeAcademics', null, {});
  }
};
