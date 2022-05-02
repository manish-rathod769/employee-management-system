

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'verifyToken', {
      type: Sequelize.STRING,
      defaultValue: null,
    }),
    queryInterface.addColumn('Users', 'isVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }),
  ]),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Users', 'verifyToken'),
    queryInterface.removeColumn('Users', 'isVerified'),
  ]),
};
