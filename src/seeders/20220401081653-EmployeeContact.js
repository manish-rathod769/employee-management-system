'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'EmployeeContacts',
      [
        {
          contactNo: "8734567389",
          employeeId: "4889ed9b-6fa3-4b25-8a27-68779ec3179f",
          houseNo: "23/A",
          addressLine1: "hera bunglow",
          addressLine2: "near hill top",
          landmark: "sitaram circle",
          city: "surat",
          state: "gujarat",
          pincode: "395006",
          country: "India",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          contactNo: "968574231",
          employeeId: "606559db-df9a-4c1f-8243-ef803e52cfa4",
          houseNo: "25/A",
          addressLine1: "shyamdham society",
          addressLine2: "near shyamdham temple",
          landmark: "shyamdham circle",
          city: "surat",
          state: "gujarat",
          pincode: "395011",
          country: "India",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          contactNo: "745896123",
          employeeId: "d475cab4-c199-40e9-813e-fa648d1c6fea",
          houseNo: "23/B",
          addressLine1: "royal palace",
          addressLine2: "beside lal bag",
          landmark: "chowk",
          city: "ahmedabad",
          state: "gujarat",
          pincode: "392406",
          country: "India",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EmployeeContacts', null, {});
  }
};
