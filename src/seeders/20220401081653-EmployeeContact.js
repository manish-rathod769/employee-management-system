

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'EmployeeContacts',
      [
        {
          contactNo: '8734567389',
          employeeId: '77cb5282-36a6-4c9e-9c8e-84f9cbec0ce7',
          houseNo: '23/A',
          addressLine1: 'hera bunglow',
          addressLine2: 'near hill top',
          landmark: 'sitaram circle',
          city: 'surat',
          state: 'gujarat',
          pincode: '395006',
          country: 'India',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          contactNo: '968574231',
          employeeId: '8ccf51cb-d271-4ba9-bb2d-a59702052e55',
          houseNo: '25/A',
          addressLine1: 'shyamdham society',
          addressLine2: 'near shyamdham temple',
          landmark: 'shyamdham circle',
          city: 'surat',
          state: 'gujarat',
          pincode: '395011',
          country: 'India',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          contactNo: '745896123',
          employeeId: 'b8cdbc59-bfa1-404f-b6d2-f1a7136d485a',
          houseNo: '23/B',
          addressLine1: 'royal palace',
          addressLine2: 'beside lal bag',
          landmark: 'chowk',
          city: 'ahmedabad',
          state: 'gujarat',
          pincode: '392406',
          country: 'India',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('EmployeeContacts', null, {});
  },
};
