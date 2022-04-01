'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Employee',
      [
        {
          firstName: 'john',
          lastName: 'william',
          middleName: 'devid',
          email: 'johnwilliam@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'male',
          role: 'ADMIN',
          DOB: new Date("31 april, 1992"),
          joiningDate: new Date("12 march, 2019"),
          totalExp: '2.6',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employee', null, {});
  }
};
