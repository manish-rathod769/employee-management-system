module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeTeches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.UUID
      },
      techId: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmployeeTeches');
  }
};