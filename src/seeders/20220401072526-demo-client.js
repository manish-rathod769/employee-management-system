'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Ciients',
      [
        {
          name: "Client 1",
          email: "client.1@bacancy.com",
          slack_id: "slack_id1",
          city: "Surat",
          state: "Gujarat",
          country: "India",
          organization: "Bacancy Technology",
          isArchive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Client 2",
          email: "client.2@bacancy.com",
          slack_id: "slack_id2",
          city: "Ahmedabad",
          state: "Gujarat",
          country: "India",
          organization: "Simform Solutions",
          isArchive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {},
    )
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Ciients', null, {})
  }
};
