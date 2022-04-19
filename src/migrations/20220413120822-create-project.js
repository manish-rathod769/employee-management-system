module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Projects', {
    projectId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('Fixed', 'Dedicated'),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('Completed', 'In Progress', 'Maintanance', 'Not Started', 'Halt'),
      allowNull: false,
    },
    probable_end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    isArchived: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Projects'),
};
