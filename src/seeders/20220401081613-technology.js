'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Technologies',
      [
        {
          techName: 'JAVA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'JavaScript',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'python',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'NodeJs',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'MongoDB',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'viwJs',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          techName: 'UI/UX',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Technologies', null, {});
  }
};
