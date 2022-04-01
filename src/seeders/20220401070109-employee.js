'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Employees',
      [
        {
          id: uuidv4(),
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          firstName: 'malin',
          lastName: 'serah',
          middleName: 'kevin',
          email: 'malinserah@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'male',
          role: 'HR',
          DOB: new Date("20 april, 1998"),
          joiningDate: new Date("12 march, 2020"),
          totalExp: '1.6',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          firstName: 'alex',
          lastName: 'botez',
          middleName: 'philip',
          email: 'alexbotez@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'female',
          role: 'PM',
          DOB: new Date("20 april, 1988"),
          joiningDate: new Date("12 march, 2015"),
          totalExp: '8.11',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', null, {});
  }
};
