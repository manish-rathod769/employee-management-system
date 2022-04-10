

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'EmployeePreWorks',
      [
        {
          employeeId: '77cb5282-36a6-4c9e-9c8e-84f9cbec0ce7',
          previousEmployer: 'l&t',
          employerAddress: 'ahmedabad, gujatat',
          workingTime: '3 years 2 month',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: '8ccf51cb-d271-4ba9-bb2d-a59702052e55',
          previousEmployer: 'infex',
          employerAddress: 'vadodara, gujatat',
          workingTime: '2 years 2 month',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: 'b8cdbc59-bfa1-404f-b6d2-f1a7136d485a',
          previousEmployer: 'softVolt',
          employerAddress: 'ahmedabad, gujatat',
          workingTime: '1 years 10 month',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('EmployeePreWorks', null, {});
  },
};
