'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Clients',
      [
        {
          id: uuidv4(),
          name: "Client 1",
          email: "client.1@bacancy.com",
          slackId: "slackId1",
          city: "Surat",
          state: "Gujarat",
          country: "India",
          organization: "Bacancy Technology",
        },
        {
          id: uuidv4(),
          name: "Client 2",
          email: "client.2@bacancy.com",
          slackId: "slackId2",
          city: "Ahmedabad",
          state: "Gujarat",
          country: "India",
          organization: "Simform Solutions",
        }
      ],
      {},
    )
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Clients', null, {})
  }
};
