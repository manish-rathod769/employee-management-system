

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'EmployeeAcademics',
      [
        {
          employeeId: '77cb5282-36a6-4c9e-9c8e-84f9cbec0ce7',
          highestQualification: 'BE',
          collage: 'VGEC',
          university: 'GTU',
          knownTech: ['Android', 'iOS', 'JavaScript'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: '8ccf51cb-d271-4ba9-bb2d-a59702052e55',
          highestQualification: 'ME',
          collage: 'PT',
          university: 'VNSGU',
          knownTech: ['UI/UX', 'python', 'XML', 'HTML'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          employeeId: 'b8cdbc59-bfa1-404f-b6d2-f1a7136d485a',
          highestQualification: 'B. Tech.',
          collage: 'nirma',
          university: 'nirma',
          knownTech: ['Java', 'PHP', 'MongoDB', 'Perl'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('EmployeeAcademics', null, {});
  },
};
