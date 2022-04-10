
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Employees',
      [
        {
          id: '77cb5282-36a6-4c9e-9c8e-84f9cbec0ce7',
          firstName: 'john',
          lastName: 'william',
          middleName: 'devid',
          email: 'johnwilliam@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'male',
          role: 'ADMIN',
          DOB: new Date('31 april, 1992'),
          joiningDate: new Date('12 march, 2019'),
          totalExp: '2.6',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '8ccf51cb-d271-4ba9-bb2d-a59702052e55',
          firstName: 'malin',
          lastName: 'serah',
          middleName: 'kevin',
          email: 'malinserah@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'male',
          role: 'HR',
          DOB: new Date('20 april, 1998'),
          joiningDate: new Date('12 march, 2020'),
          totalExp: '1.6',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'b8cdbc59-bfa1-404f-b6d2-f1a7136d485a',
          firstName: 'alex',
          lastName: 'botez',
          middleName: 'philip',
          email: 'alexbotez@gmail.com',
          password: '25d55ad283aa400af464c76d713c07ad',
          gender: 'female',
          role: 'PM',
          DOB: new Date('20 april, 1988'),
          joiningDate: new Date('12 march, 2015'),
          totalExp: '8.11',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Employees', null, {});
  },
};
