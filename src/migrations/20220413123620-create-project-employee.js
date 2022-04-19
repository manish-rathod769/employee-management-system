module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ProjectEmployees', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    projectId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    employeeId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.dropTable('ProjectEmployees'),
};
